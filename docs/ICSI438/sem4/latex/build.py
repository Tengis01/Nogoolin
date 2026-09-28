#!/usr/bin/env python3
"""Build the Seminar 4 arc42/C4/ADR document and merged PDF."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from pathlib import Path


LATEX_DIR = Path(__file__).resolve().parent
SEM4_DIR = LATEX_DIR.parent
REPO = SEM4_DIR.parents[2]
REPORT_MD = LATEX_DIR / "sem4_report.md"
REPORT_TEX = LATEX_DIR / "sem4_merged.tex"
DIAGRAM_DIR = SEM4_DIR / "diagrams"
ASSET_DIR = SEM4_DIR / "assets"
DIAGRAM_PDF_DIR = SEM4_DIR / "tmp/diagrams"
MMDC = SEM4_DIR / "tools/node_modules/.bin/mmdc"

SOURCES = [
    REPO / "docs/architecture/arc42-nogoolin.md",
    REPO / "docs/architecture/architecture-traceability.md",
    REPO / "docs/architecture/adr/adr-003-fastify.md",
    REPO / "docs/architecture/adr/adr-005-supabase.md",
    REPO / "docs/architecture/adr/m4-if-01-rest-interface.md",
    SEM4_DIR / "wiki/ue4-rework.md",
    SEM4_DIR / "wiki/ue4-refactoring-adr.md",
    SEM4_DIR / "wiki/reflection.md",
]


def run(command: list[str], cwd: Path = LATEX_DIR) -> None:
    subprocess.run(command, cwd=cwd, check=True)


def render_diagrams() -> None:
    if not MMDC.exists():
        raise SystemExit(
            "Mermaid CLI missing. Run: npm --prefix docs/ICSI438/sem4/tools install"
        )
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    DIAGRAM_PDF_DIR.mkdir(parents=True, exist_ok=True)
    previews = ["# Mermaid C4 sources\n\nTyped flowcharts implement C4 static views; sequence diagrams implement C4 runtime views.\n\n"]
    for source in sorted(DIAGRAM_DIR.glob("*.mmd")):
        previews.append(f"## {source.stem}\n\n```mermaid\n{source.read_text(encoding='utf-8')}```\n\n")
    (DIAGRAM_DIR / "README.md").write_text("".join(previews), encoding="utf-8")
    config = DIAGRAM_DIR / "mermaid-config.json"
    browser = os.environ.get("PUPPETEER_EXECUTABLE_PATH")
    if not browser:
        candidates = sorted((Path.home() / ".cache/puppeteer/chrome").glob("*/chrome-linux64/chrome"))
        browser = str(candidates[-1]) if candidates else None
    launch = {"args": ["--no-sandbox"]}
    if browser:
        launch["executablePath"] = browser
    browser_config = SEM4_DIR / "tmp/puppeteer-config.json"
    browser_config.write_text(json.dumps(launch), encoding="utf-8")
    for source in sorted(DIAGRAM_DIR.glob("*.mmd")):
        svg = ASSET_DIR / f"{source.stem}.svg"
        pdf = DIAGRAM_PDF_DIR / f"{source.stem}.pdf"
        run(
            [
                str(MMDC),
                "-i",
                str(source),
                "-o",
                str(svg),
                "-c",
                str(config),
                "-p",
                str(browser_config),
                "-b",
                "white",
                "-w",
                "1600",
                "-H",
                "1000",
                "-s",
                "1.5",
            ],
            SEM4_DIR,
        )
        svg_text = svg.read_text(encoding="utf-8")
        svg_text = re.sub(r"<(text|tspan)(?=[ >])", r'<\1 xml:space="preserve"', svg_text)
        svg.write_text(svg_text, encoding="utf-8")
        run(
            [
                "inkscape",
                str(svg),
                "--export-type=pdf",
                f"--export-filename={pdf}",
            ],
            SEM4_DIR,
        )


def assemble_markdown() -> None:
    front = """---
lang: mn
---

\\input{sem4-title.tex}

"""
    chunks = [front]
    for index, source in enumerate(SOURCES):
        text = source.read_text(encoding="utf-8")
        if source.name in {"arc42-nogoolin.md", "ue4-rework.md"}:
            for diagram in sorted(DIAGRAM_DIR.glob("*.mmd")):
                text = text.replace(
                    f"../ICSI438/sem4/assets/{diagram.stem}.svg",
                    f"../tmp/diagrams/{diagram.stem}.pdf",
                )
                text = text.replace(f"../assets/{diagram.stem}.svg", f"../tmp/diagrams/{diagram.stem}.pdf")
        if source.name == "architecture-traceability.md":
            text = text.replace(
                "| ID | Architecture responsibility | arc42 | C4 view | ADR | Architecture status |",
                "\\begingroup\\footnotesize\\setlength{\\tabcolsep}{2pt}\\sloppy\n\n"
                "| ID | Architecture responsibility | arc42 | C4 view | ADR | Architecture status |",
                1,
            )
            text = text.replace(
                "\n## Coverage summary",
                "\n\\endgroup\n\n## Coverage summary",
                1,
            )
        def resolve_link(match):
            label, target = match.groups()
            if target.startswith(("http:", "https:", "#")) or target.endswith(".pdf"):
                return match.group(0)
            file_part, _, anchor = target.partition("#")
            resolved = (source.parent / file_part).resolve()
            if resolved.is_relative_to(REPO):
                url = "https://github.com/Tengis01/Nogoolin/blob/main/" + resolved.relative_to(REPO).as_posix()
                if anchor:
                    url += "#" + anchor
                return f"[{label}]({url})"
            return match.group(0)
        text = re.sub(r"(?<!!)\[([^\]]+)\]\(([^)]+)\)", resolve_link, text)
        if index:
            chunks.append("\n\\newpage\n\n")
        chunks.append(text)
    REPORT_MD.write_text("".join(chunks), encoding="utf-8")


def generate_tex() -> None:
    run(
        [
            "pandoc",
            REPORT_MD.name,
            "--from=markdown+raw_tex",
            "--to=latex",
            "--standalone",
            "--top-level-division=section",
            "--include-in-header=header.tex",
            "--resource-path=.:../assets:../tmp/diagrams:../../..",
            "-o",
            REPORT_TEX.name,
        ]
    )
    tex = REPORT_TEX.read_text(encoding="utf-8")
    tex = tex.replace("\\begin{figure}", "\\begin{figure}[H]")
    tex = tex.replace("height=\\textheight", "height=0.72\\textheight")
    REPORT_TEX.write_text(tex, encoding="utf-8")


def compile_tex() -> None:
    # A clean checkout includes SVGs, while intermediate vector PDFs are ignored.
    DIAGRAM_PDF_DIR.mkdir(parents=True, exist_ok=True)
    for svg in sorted(ASSET_DIR.glob("*.svg")):
        pdf = DIAGRAM_PDF_DIR / f"{svg.stem}.pdf"
        if not pdf.exists() or pdf.stat().st_mtime < svg.stat().st_mtime:
            run(["inkscape", str(svg), "--export-type=pdf",
                 f"--export-filename={pdf}"], SEM4_DIR)
    (SEM4_DIR / "tmp/pdfs").mkdir(parents=True, exist_ok=True)
    run(["latexmk", "-g", REPORT_TEX.name])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--from-markdown",
        action="store_true",
        help="Render Mermaid and regenerate Markdown/TeX before compiling.",
    )
    args = parser.parse_args()
    if args.from_markdown:
        render_diagrams()
        assemble_markdown()
        generate_tex()
    if not REPORT_TEX.exists():
        raise SystemExit("sem4_merged.tex is missing; run with --from-markdown once")
    compile_tex()


if __name__ == "__main__":
    main()
