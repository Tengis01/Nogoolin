#!/usr/bin/env python3
"""Compile editable Seminar 6 TeX; regenerate only with --from-markdown."""
from pathlib import Path
import argparse
import subprocess

HERE = Path(__file__).resolve().parent
SEM = HERE.parent
TEX = HERE / 'sem6_merged.tex'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--from-markdown', action='store_true')
    args = parser.parse_args()
    if args.from_markdown:
        source = (SEM / 'wiki/sem6-report.md').read_text(encoding='utf8')
        source = source.replace('](../', '](')
        md = HERE / 'sem6_report.md'
        md.write_text('---\nlang: mn\n---\n\n\\input{sem6-title.tex}\n\n' + source, encoding='utf8')
        subprocess.run(['pandoc', md.name, '--from=markdown+raw_tex', '--to=latex', '--standalone', '--top-level-division=section', '--include-in-header=header.tex', '-o', TEX.name], cwd=HERE, check=True)
    if not TEX.exists():
        raise SystemExit('Generate TeX first with --from-markdown')
    (SEM / 'tmp/pdfs').mkdir(parents=True, exist_ok=True)
    subprocess.run(['latexmk', '-g', TEX.name], cwd=HERE, check=True)

if __name__ == '__main__':
    main()
