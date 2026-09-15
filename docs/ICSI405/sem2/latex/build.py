#!/usr/bin/env python3
"""Export the canonical M2 Markdown to editable XeLaTeX and two final PDFs."""
from pathlib import Path
import copy, json, os, re, subprocess
from urllib.parse import urlsplit, unquote, quote

HERE = Path(__file__).resolve().parent
SEM = HERE.parent
ROOT = SEM.parents[2]
TMP = SEM / 'tmp/pdfs'
TMP.mkdir(parents=True, exist_ok=True)
SOURCES = [
    ROOT/'docs/requirements/scope-charter.md',
    SEM/'wiki/persona-and-pivot.md',
    ROOT/'docs/requirements/srs-template.md',
    ROOT/'docs/requirements/requirements.md',
    ROOT/'docs/requirements/traceability-matrix.md',
    ROOT/'docs/architecture/sdd-template.md',
    SEM/'wiki/peer-review-draft.md',
]
HEADER = r'''
\usepackage{fontspec}
\setmainfont{Liberation Serif}
\setsansfont{Liberation Sans}
\setmonofont{Liberation Mono}[Scale=0.86]
\usepackage{ragged2e,indentfirst,xurl}
\usepackage{longtable,booktabs,array,calc,pdflscape}
\usepackage{xcolor,fancyhdr,titlesec,enumitem}
\definecolor{ink}{HTML}{19354A}
\definecolor{accent}{HTML}{167D8D}
\titleformat{\section}{\Large\sffamily\bfseries\color{ink}}{}{0pt}{}
\titleformat{\subsection}{\normalsize\sffamily\bfseries\color{ink}}{}{0pt}{}
\titleformat{\subsubsection}{\normalsize\sffamily\bfseries\color{ink}}{}{0pt}{}
\titlespacing*{\section}{0pt}{0pt}{8pt}
\titlespacing*{\subsection}{0pt}{8pt}{4pt}
\titlespacing*{\subsubsection}{0pt}{6pt}{3pt}
\setlength{\parindent}{1.25cm}
\setlength{\parskip}{3pt}
\setlength{\emergencystretch}{3em}
\setlength{\tabcolsep}{4pt}
\renewcommand{\arraystretch}{1.08}
\setlist{nosep,leftmargin=1.5em,topsep=3pt}
\pagestyle{fancy}\fancyhf{}
\fancyhead[L]{\small\sffamily ICSI405 / SEMINAR 02}
\fancyhead[R]{\small\sffamily Nogoolin / M2}
\fancyfoot[R]{\small\thepage}
\renewcommand{\headrulewidth}{0.3pt}
\AtBeginDocument{\fontsize{10.5}{12.5}\selectfont\justifying\setlength{\parindent}{1.25cm}}
'''
(HERE/'header.tex').write_text(HEADER)

def walk(value, source, prefix):
    if isinstance(value, list):
        return [walk(x, source, prefix) for x in value]
    if not isinstance(value, dict):
        return value
    obj = {k: walk(v, source, prefix) for k, v in value.items()}
    kind = obj.get('t')
    if kind == 'Header':
        obj['c'][1][0] = prefix + '-' + obj['c'][1][0]
    elif kind == 'Link':
        target = obj['c'][2][0]
        u = urlsplit(target)
        if not u.scheme and u.path:
            absolute = (source.parent / unquote(u.path)).resolve()
            obj['c'][2][0] = quote(os.path.relpath(absolute, SEM), safe='/') + (('#'+u.fragment) if u.fragment else '')
    elif kind == 'Code':
        code = obj['c'][1]
        if '{' not in code and '}' not in code:
            return {'t':'RawInline', 'c':['latex', r'\nolinkurl{'+code+'}']}
    elif kind == 'Table':
        n = len(obj['c'][2])
        # Widths are proportional to usable text width; prioritize explanatory cells.
        if n == 8:
            widths = [.065,.255,.065,.12,.115,.145,.14,.095]
        elif n == 4:
            widths = [.20,.19,.35,.26]
        elif n == 3:
            widths = [.26,.55,.19]
        elif n == 2:
            widths = [.25,.75]
        else:
            widths = [1/n]*n
        for col, width in zip(obj['c'][2], widths):
            col[1] = {'t':'ColWidth','c':width}
    return obj

def fragment(source, index):
    data = json.loads(subprocess.check_output(['pandoc',str(source),'-f','markdown','-t','json'],text=True))
    data = walk(data, source, f'doc{index}')
    out = subprocess.check_output(['pandoc','-f','json','-t','latex','--top-level-division=section'],input=json.dumps(data),text=True)
    # Keep table text ragged right; full justification of narrow table cells harms legibility.
    if source.name == 'requirements.md':
        out = out.replace(r'\subsection{NFR-02}',r'\clearpage'+'\n'+r'\subsection{NFR-02}')
    if source.name == 'sdd-template.md':
        out = out.replace(r'\subsection{5. Гадаад',r'\clearpage'+'\n'+r'\subsection{5. Гадаад')
    (HERE/f'{index:02d}_{source.stem}.tex').write_text(out)
    return out

parts = [fragment(source,i+1) for i,source in enumerate(SOURCES)]
for name, blocks in [('SRS-Scope-Charter',[parts[0]]),('sem2_merged',parts)]:
    body=[]
    for i, block in enumerate(blocks):
        if i: body.append(r'\clearpage')
        if name=='sem2_merged' and i==4:
            body.append(r'\begin{landscape}')
            body.append(block)
            body.append(r'\end{landscape}')
        else:
            body.append(block)
    # Pandoc supplies version-compatible packages/macros for table export.
    skeleton = subprocess.check_output([
        'pandoc','-f','markdown','-t','latex','-s','--pdf-engine=xelatex',
        '-V','documentclass=article','-V','papersize=a4','-V','fontsize=11pt',
        '-V','geometry:margin=19mm','-V','geometry:headheight=15pt',
        '-V','colorlinks=true','-V','urlcolor=blue!55!black',
        '--include-in-header',str(HERE/'header.tex')
    ],input='BODYPLACEHOLDER',text=True)
    tex=skeleton.replace('BODYPLACEHOLDER','\n'.join(body))
    # The standalone seed has no table; provide the pandoc table counter shim.
    tex=tex.replace(r'\begin{document}',r'\newcounter{none}'+ '\n' +r'\begin{document}')
    path=HERE/(name+'.tex'); path.write_text(tex)
    for _ in range(2):
        result=subprocess.run(['xelatex','-interaction=nonstopmode','-halt-on-error','-output-directory='+str(TMP),str(path)],cwd=SEM,text=True,capture_output=True)
        (TMP/(name+'.build-output.txt')).write_text(result.stdout+result.stderr)
        if result.returncode:
            raise RuntimeError(f'XeLaTeX failed: {TMP/(name+".build-output.txt")}\n'+result.stdout[-2200:])
    log=(TMP/(name+'.log')).read_text()
    issues=[l for l in log.splitlines() if 'Overfull' in l or 'Missing character' in l or 'undefined references' in l]
    if issues:
        raise RuntimeError(name+' layout check failed: '+'\n'.join(issues))
    (SEM/(name+'.pdf')).write_bytes((TMP/(name+'.pdf')).read_bytes())
    print('Built',SEM/(name+'.pdf'))
