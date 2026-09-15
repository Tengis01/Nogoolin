# Documentation environment; project sources are mounted by Dev Containers.
FROM mcr.microsoft.com/devcontainers/base:ubuntu24.04

USER root

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        fontconfig \
        fonts-liberation \
        latexmk \
        pandoc \
        poppler-utils \
        python3 \
        texlive-fonts-recommended \
        texlive-latex-extra \
        texlive-xetex \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER vscode
