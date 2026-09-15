#!/usr/bin/env bash
# Read-only readiness check. Never regenerate Markdown/TeX or modify PDFs.
set -euo pipefail

for tool in xelatex latexmk pandoc python3 pdfinfo pdftoppm fc-match kpsewhich; do
    if ! command -v "$tool" >/dev/null; then
        printf 'Missing documentation tool: %s\n' "$tool" >&2
        exit 1
    fi
done

for font in 'Liberation Serif' 'Liberation Sans' 'Liberation Mono'; do
    family=$(fc-match --format '%{family}' "$font")
    if [[ "$family" != "$font" && "$family" != "$font,"* ]]; then
        printf 'Missing font: %s (fontconfig substituted %s)\n' "$font" "$family" >&2
        exit 1
    fi
done

for package in fontspec.sty unicode-math.sty xurl.sty titlesec.sty fancyhdr.sty \
               pdflscape.sty fvextra.sty longtable.sty bookmark.sty; do
    if ! kpsewhich "$package" >/dev/null; then
        printf 'Missing LaTeX package: %s\n' "$package" >&2
        exit 1
    fi
done

printf '%s\n' 'Documentation tools, LaTeX packages and Liberation fonts are ready.'
printf '%s\n' 'Edit docs/ICSI405/sem2/latex/sem2_merged.tex and save to build its PDF.'
