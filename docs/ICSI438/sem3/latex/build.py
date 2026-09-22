#!/usr/bin/env python3
"""Build the editable Seminar 3 LaTeX source and merged PDF."""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path


LATEX_DIR = Path(__file__).resolve().parent
SEM3_DIR = LATEX_DIR.parent
REPO = SEM3_DIR.parents[2]
REPORT_MD = LATEX_DIR / "sem3_report.md"
REPORT_TEX = LATEX_DIR / "sem3_merged.tex"

SOURCES = [
    REPO / "docs/requirements/srs-v1.0.md",
    REPO / "docs/requirements/traceability-matrix-v1.0.md",
    SEM3_DIR / "wiki/human-vs-ai-comparison.md",
    SEM3_DIR / "wiki/ue3-corgly.md",
    SEM3_DIR / "wiki/reflection.md",
]

MOCKS = [
    ("MUI-01 — Inquiry form", "01-inquiry-form.png"),
    ("MUI-02 — Inquiry success", "02-inquiry-success.png"),
    ("MUI-03 — Inquiry history", "03-inquiry-history.png"),
    ("MUI-04 — Admin inquiry inbox", "04-admin-inbox.png"),
    ("MUI-05 — Wishlist", "05-wishlist.png"),
]


def assemble_markdown() -> None:
    front = """---
lang: mn
---

\\input{sem3-title.tex}

"""
    chunks = [front]
    for index, source in enumerate(SOURCES):
        text = source.read_text(encoding="utf-8")
        text = text.replace("../ICSI438/sem3/assets/", "../assets/")
        if source.name == "traceability-matrix-v1.0.md":
            text = text.replace(
                "| ID | Source | Owner | Verification | Dependency | Risk | Status | Last-Reviewed |",
                "\\begingroup\\footnotesize\\setlength{\\tabcolsep}{2pt}\n\n"
                "| ID | Source | Owner | Verification | Dependency | Risk | Status | Last-Reviewed |",
                1,
            )
        if source.name == "human-vs-ai-comparison.md":
            text = text.replace(
                "| № | AI candidate | Илэрсэн зөрүү | Эхээр шалгасан засвар | Cite |",
                "\\begingroup\\footnotesize\\setlength{\\tabcolsep}{2pt}\\sloppy\n\n"
                "| № | AI candidate | Илэрсэн зөрүү | Эхээр шалгасан засвар | Cite |",
                1,
            )
            text = text.replace(
                "\n## Use–Verify–Cite протокол",
                "\n\\endgroup\n\n## Use–Verify–Cite протокол",
                1,
            )
            text = text.replace(
                "\n## W1 persona холбоо",
                "\n\\endgroup\n\n## W1 persona холбоо",
                1,
            )
        if index:
            chunks.append("\n\\newpage\n\n")
        chunks.append(text)

    chunks.append("\n\\newpage\n\n# Mock UI acceptance screenshots\n\n")
    chunks.append(
        "Эдгээр нь requirement-ийн acceptance criteria-г тайлбарлах mock зураг; "
        "ажиллаж буй production UI-ийн test evidence биш.\n\n"
    )
    for index, (title, filename) in enumerate(MOCKS):
        chunks.append(f"## {title}\n\n![](../assets/{filename}){{width=92%}}\n")
        if index != len(MOCKS) - 1:
            chunks.append("\n\\newpage\n\n")
    REPORT_MD.write_text("".join(chunks), encoding="utf-8")


def generate_tex() -> None:
    subprocess.run(
        [
            "pandoc",
            REPORT_MD.name,
            "--from=markdown+raw_tex",
            "--to=latex",
            "--standalone",
            "--top-level-division=section",
            "--include-in-header=header.tex",
            "--resource-path=.:../assets:../../..",
            "-o",
            REPORT_TEX.name,
        ],
        cwd=LATEX_DIR,
        check=True,
    )


def compile_tex() -> None:
    (SEM3_DIR / "tmp/pdfs").mkdir(parents=True, exist_ok=True)
    subprocess.run(["latexmk", "-g", REPORT_TEX.name], cwd=LATEX_DIR, check=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--from-markdown",
        action="store_true",
        help="Regenerate sem3_report.md and sem3_merged.tex before compiling.",
    )
    args = parser.parse_args()
    if args.from_markdown:
        assemble_markdown()
        generate_tex()
    if not REPORT_TEX.exists():
        raise SystemExit("sem3_merged.tex is missing; run with --from-markdown once")
    compile_tex()


if __name__ == "__main__":
    main()
