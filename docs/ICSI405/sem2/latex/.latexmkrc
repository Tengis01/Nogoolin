# Compile the existing editable TeX; never regenerate it from Markdown.
@default_files = ('sem2_merged.tex');
$pdf_mode = 5;  # XeLaTeX
$xelatex = 'xelatex -synctex=1 -interaction=nonstopmode -halt-on-error -file-line-error %O %S';
$aux_dir = '../tmp/pdfs';
$out_dir = '..';
$emulate_aux = 1;  # TeX Live: keep aux/log files separate from the final PDF.
