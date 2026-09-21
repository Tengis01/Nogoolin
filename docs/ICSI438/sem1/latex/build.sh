#!/usr/bin/env bash
set -euo pipefail
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
seminar_dir="$(cd -- "$script_dir/.." && pwd)"
build_dir="$seminar_dir/tmp/pdfs"
output_dir="$seminar_dir"
mkdir -p "$build_dir" "$output_dir"
for source in "$script_dir"/0*.tex; do
  name="$(basename "$source" .tex)"
  for pass in 1 2; do
    xelatex -interaction=nonstopmode -halt-on-error -output-directory="$build_dir" "$source" > "$build_dir/$name.build-output.txt"
  done
  if rg 'Overfull|Missing character' "$build_dir/$name.log"; then
    echo "Layout or font issue in $name" >&2
    exit 1
  fi
  cp "$build_dir/$name.pdf" "$output_dir/$name.pdf"
  echo "Built $output_dir/$name.pdf"
done
