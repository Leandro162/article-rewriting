# Article Rewriting

A browser-based batch rewriting tool for HTML articles. It imports multiple HTML files, rewrites article text with the DeepSeek API, keeps image placeholders during rewriting, and restores the original image tags when exporting HTML results.

[中文](README.zh-CN.md) · [Back to home](../README.md)

## Features

- Drag-and-drop or click-to-upload `.html` / `.htm` files
- Batch import with per-file status: pending, running, completed, failed
- Original preview and rewritten result tabs
- Image placeholders such as `[IMAGE_N]` during preview and model input
- Configurable DeepSeek API Key, model, concurrency, temperature, and System Prompt
- Live logs, token usage, and estimated cost
- Export all completed results as a zip package

## Local Usage

Open `index.html` directly in a browser.

## GitHub Pages Deployment

After pushing the repository to GitHub, open `Settings -> Pages` and choose GitHub Actions deployment. This project includes `.github/workflows/pages.yml`, so pushes to `main` can publish the static site automatically.

## Notes

This version calls the DeepSeek API directly from the browser. Do not commit API keys to the repository. For public or team usage, a backend proxy is recommended to protect the API key and reduce browser CORS issues.
