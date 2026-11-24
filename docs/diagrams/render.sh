#!/usr/bin/env bash
# Диаграмын эхийг rendered/*.svg болгоно. Алдаатай бол зогсоно.
# Шаардлага: Java + PlantUML jar (PLANTUML_JAR), Mermaid CLI (MMDC, анхдагч нь npx).
# Эх: ICSI438 sem10/docs/diagrams/render.sh (PNG гаралтыг хассан).
set -euo pipefail
cd "$(dirname "$0")"
PLANTUML_JAR="${PLANTUML_JAR:-$HOME/.vscode/extensions/jebbs.plantuml-2.18.1/plantuml.jar}"
MMDC="${MMDC:-npx --yes @mermaid-js/mermaid-cli}"
mkdir -p rendered
java -jar "$PLANTUML_JAR" -failfast2 -tsvg -o rendered *.puml
for f in *.mmd; do
  $MMDC -q -i "$f" -o "rendered/${f%.mmd}.svg"
done
ls rendered
