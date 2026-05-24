# Article Rewriting

| metadata | value |
| --- | --- |
| language | [中文](docs/README.zh-CN.md) · [English](docs/README.en.md) |
| tags | html · deepseek · article-rewriting · batch-processing · github-pages · cloudflare-worker · zip-export |
| license | Not specified |

## Article Rewriting

Batch rewrite HTML articles with DeepSeek V4 through a small proxy API, keep image placeholders during rewriting, and export restored HTML files as a zip package.

## Languages

- [中文说明](docs/README.zh-CN.md)
- [English README](docs/README.en.md)

## Quick Start

Open `index.html` in a browser, or deploy this repository with GitHub Pages. The secure DeepSeek proxy is deployed at `https://article-rewriting-api.xuelong528.workers.dev`.

## Notes

The browser never receives the DeepSeek API key. Store `DEEPSEEK_API_KEY` and `ACCESS_TOKEN` as Worker secrets.
