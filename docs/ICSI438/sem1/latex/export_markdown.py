"""Export current LaTeX content to the accompanying Markdown files."""
from pathlib import Path
import subprocess

seminar = Path(__file__).resolve().parents[1]
for source in sorted((seminar / "latex").glob("0*.tex")):
    content = source.read_text()
    lines = content.splitlines()
    for index, line in enumerate(lines):
        if line.startswith(r"\newcommand{\dochead}"):
            lines[index] = r"\newcommand{\dochead}[3]{\section*{#2}#1\par#3\par}"
        elif line.startswith(r"\newcommand{\note}"):
            lines[index] = r"\newcommand{\note}[1]{\textbf{Тайлбар.} #1\par}"
        elif line.startswith(r"\newcommand{\pathref}"):
            lines[index] = r"\newcommand{\pathref}[1]{\texttt{#1}}"
    intermediate = seminar / "tmp" / source.name
    intermediate.write_text("\n".join(lines))
    subprocess.run([
        "pandoc", "-f", "latex", "-t", "gfm", "--wrap=none",
        str(intermediate), "-o", str(seminar / "wiki" / (source.stem + ".md")),
    ], check=True)
    if source.stem == "04_writer_in_the_middle":
        essay = content.split(r"\section{200 үгийн reflection}", 1)[1]
        essay = essay.split(r"\section{", 1)[0].strip()
        assert len(essay.split()) == 200, len(essay.split())
        (seminar / "latex" / "reflection_200_words.txt").write_text(essay + "\n")

reflection = (seminar / "wiki" / "04_writer_in_the_middle.md").read_text()
(seminar / "wiki" / "UE1_Corgly_Roleplay.md").write_text(
    reflection[reflection.index("# UE-1:"):]
)
