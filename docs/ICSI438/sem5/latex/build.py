#!/usr/bin/env python3
"""Build the Seminar 5 report; TeX is the editable source after generation."""

from __future__ import annotations

import argparse
import re
import subprocess
from pathlib import Path


HERE = Path(__file__).resolve().parent
SEM = HERE.parent
SOURCE = SEM / "wiki/sem5-report.md"
REPORT_MD = HERE / "sem5_report.md"
REPORT_TEX = HERE / "sem5_merged.tex"


def generate_tex() -> None:
    source = SOURCE.read_text(encoding="utf-8")
    section = source.split("## Swagger UI ба Redoc — шийдвэрийн тайлан (100 үг)", 1)[1]
    decision = section.split("## Reflection", 1)[0].strip()
    if len(decision.split()) != 100:
        raise SystemExit(f"Decision report must be 100 words; got {len(decision.split())}")
    for sample in sorted((SEM / "samples").glob("*.py")):
        marker = f"<!-- SAMPLE:{sample.name} -->"
        if marker not in source:
            raise SystemExit(f"Missing sample marker: {marker}")
        code = sample.read_text(encoding="utf-8").rstrip()
        source = source.replace(marker, f"```python\n{code}\n```")
    if re.search(r"<!-- SAMPLE:[^>]+ -->", source):
        raise SystemExit("Unresolved sample marker")
    # Source links are relative to wiki/; PDF links are relative to sem5/.
    source = source.replace("](../", "](")
    REPORT_MD.write_text(
        "---\nlang: mn\n---\n\n\\input{sem5-title.tex}\n\n" + source,
        encoding="utf-8",
    )
    subprocess.run(
        [
            "pandoc", REPORT_MD.name, "--from=markdown+raw_tex", "--to=latex",
            "--standalone", "--top-level-division=section",
            "--include-in-header=header.tex", "-o", REPORT_TEX.name,
        ],
        cwd=HERE,
        check=True,
    )


def compile_tex() -> None:
    (SEM / "tmp/pdfs").mkdir(parents=True, exist_ok=True)
    subprocess.run(["latexmk", "-g", REPORT_TEX.name], cwd=HERE, check=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--from-markdown", action="store_true")
    args = parser.parse_args()
    if args.from_markdown:
        generate_tex()
    if not REPORT_TEX.exists():
        raise SystemExit("Generate TeX first with --from-markdown")
    compile_tex()


if __name__ == "__main__":
    main()
