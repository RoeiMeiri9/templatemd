# TemplateMD
This is the parser for TemplateMD.

## How to work with TemplateMD
Working with TemplateMD is easy - especially if you install the TemplateMD for Visual Studio Code.
Just make a new `.tmd` file, write your Markdown file as usual, and each time you want to insert a recurring string, write "" and insert your value inside.

All of the values must be written under `variables` in the `Front Matter`, for example:

```YAML
---
variables:
  app-name: "TemplateMD"
  version: "0.0.1"
  author: "Roei Meiri"
  date: "22/11/2025"
  mark-down: "Markdown"
  file-type: "`.tmd`"
  markdown-file-type: "`.md`"
---
```

To compile the `.tmd` file, install the TemplateMD package using:
```CLI
npm install tmd
```

And then run:
```
tmd -- watch path\to\file-or-folder
```

Then, every time you save your `.tmd` file, a `.md` file will be generated next to the original `.tmd`.

## Benchmarks
More to come, stay tunes :)

| File Size  | Time (in ms) |
| ---------- | ------------ |
| < 1mb      | ~0 - 4       |
| 14mb       | ~451         |

## License

This project is license under the ___

## 