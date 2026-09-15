# Documentation devcontainer

Nogoolin-ийн LaTeX/Markdown ажилд зориулсан Ubuntu 24.04 орчин. XeLaTeX,
latexmk, Pandoc, Python 3, Liberation фонтууд, PDF шалгах Poppler хэрэгслүүд
болон LaTeX Workshop орно. Git нь base image-д бий.

Энэ орчин application dependency суулгахгүй, API/web/database асаахгүй.
Repository-ийн `.env` болон source-ыг Docker image рүү хуулдаггүй.

## GitHub Codespaces

1. `.devcontainer/` болон одоогийн LaTeX тохиргоонууд орсон commit-оо GitHub
   руу push хийнэ. Тэр branch дээр **Code → Codespaces → Create codespace**.
2. Өмнө үүсгэсэн Codespace бол өөрчлөлтөө pull хийгээд Command Palette-аас
   **Codespaces: Rebuild Container** ажиллуулна.
3. Анхны build/LaTeX Workshop суулгалт дуустал хүлээнэ. `postCreateCommand`
   нь compiler, font, package байгаа эсэхийг шалгана; баримтын эхийг өөрчлөхгүй.
4. `docs/ICSI405/sem2/latex/sem2_merged.tex`-ийг нээж **Ctrl+S** дарна.
5. **LaTeX Workshop: View LaTeX PDF file** командаар preview нээнэ.

Codespace-д Nogoolin root нь workspace байхад `.vscode/settings.json`
ачаалагдана. PDF ба SyncTeX `docs/ICSI405/sem2/`, завсрын файлууд
`docs/ICSI405/sem2/tmp/pdfs/` дотор гарна. `github.dev` editor нь өөрөө
terminal/compiler ажиллуулах орчингүй тул энэ build-д **Codespaces** хэрэглэнэ.

## Local VS Code

Docker Engine/Desktop болон VS Code-ийн **Dev Containers** extension-тай
үед Nogoolin root-ийг нээгээд **Dev Containers: Reopen in Container**.
Linux дээр Docker socket-д ажиллуулж буй хэрэглэгч хандах эрхтэй байх хэрэгтэй.
Тусдаа `sem2.code-workspace`-оос бус, repo root-оос container нээнэ.

## Командууд

Repository root-оос:

```bash
# Орчныг шалгах
bash .devcontainer/check-environment.sh

# Одоогийн хоёр TeX эхээс PDF хөрвүүлэх; TeX гар засвар хэвээр үлдэнэ
python3 docs/ICSI405/sem2/latex/build.py
```

## Анхаарах зүйл

- **Ctrl+S нь PDF хөрвүүлнэ; Git commit/push тусдаа үйлдэл.** Өөр машин/OS-оос
  үргэлжлүүлэхийн өмнө pull хийж, давхар засварын conflict-ийг шийднэ.
- **Markdown ба TeX хоёр чиглэлд автоматаар sync болохгүй.** Одоогийн нэгдсэн
  тайланг `sem2_merged.tex` дээр засна. `build.py --from-markdown` нь TeX дээрх
  гар засварыг Markdown хувилбараар солино; auto-build үүнийг ашиглахгүй.
- `01_…07_*.tex` нь экспортын хэсгүүд бөгөөд одоогийн main файл тэдгээрийг
  `input` хийдэггүй. Тэдгээрийг засахад main PDF-ийн агуулга өөрчлөгдөхгүй.
- Анхны TeX Live таталт/build нь хэдэн минут, нэлээд диск шаардана. Codespaces
  хэрэглээгээ GitHub-ийн quota/billing хэсгээс шалгаж, ажил дуусахад Stop хийнэ.
- Dockerfile/package жагсаалтыг өөрчилбөл **Rebuild Container** хийнэ.
- Ubuntu 24.04 суурийг тогтоосон боловч image tag болон apt package-ууд security
  update авна; byte-for-byte ижил build гэсэн баталгаа биш. Fedora дахь TeX Live
  хувилбараас хамаарч хуудас таслалт бага зэрэг өөр байж болно. Хүлээлгэн өгөх
  PDF-ээ нэг орчинд хөрвүүлж, хуудсуудыг эцэст нь шалгана.
- `tmp/`, `.aux/.log` болон SyncTeX Git-д орохгүй. `.gitattributes` нь shell,
  Python, TeX, Markdown эхийн LF мөр төгсгөлийг Windows/Linux-д нийцүүлнэ.

## Эх сурвалж

- [GitHub: devcontainer configuration](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)
- [VS Code: Create a Dev Container](https://code.visualstudio.com/docs/devcontainers/create-dev-container)
- [Ubuntu base image](https://github.com/devcontainers/images/tree/main/src/base-ubuntu)
