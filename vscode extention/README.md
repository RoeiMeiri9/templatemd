# TemplateMD

Write Markdown with Template.\
This is the official syntax highlighting support for TemplateMD.

To work with the syntax, you must install first the TemplateMD package from npm, then run it with `tmd --watch ./your/path/here`

## Required tools

In order to compile a `.tmd` file to a `.md` file, you need to install the tmd package from npm:

```BASH
$ npm install tmd
```

then ran:

```BASH
$ tmd -- --watch path/to/your/file-or-folder
```

For more detailed explanation, visit [the official github page](https://github.com/RoeiMeiri9/templatemd/tree/master/npm%20package)

## Features

- Write Markdown files with variables
- IntelliSense support

![Intellisense in action](https://raw.githubusercontent.com/RoeiMeiri9/templatemd/refs/heads/master/vscode%20extention/branding/tmd.gif)

## Prettifying

If you want to prettifying a `.tmd` file, you need to choose prettier as your default prettifier (you can download it from here: [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))

Then just prettify the `.tmd` file as usual.

## Release Notes

### 1.0.0

Initial release of TemplateMD

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3).
See the LICENSE file for details.
