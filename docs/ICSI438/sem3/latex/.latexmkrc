@default_files = ('sem3_merged.tex');
$pdf_mode = 5;
$xelatex = 'xelatex -synctex=1 -interaction=nonstopmode -halt-on-error -file-line-error %O %S';
$aux_dir = '../tmp/pdfs';
$out_dir = '..';
$emulate_aux = 1;

