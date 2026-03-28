# ExtendedMD (EMD)

**ExtendedMD (EMD)** is a powerful enhancement of the standard Markdown syntax, designed to bridge the gap between static text and dynamic content. 

While standard Markdown is great for documentation, it lacks the ability to reuse data or handle logic. **EMD** solves this by introducing a compilation layer that transforms dynamic `.emd` files into clean, ready-to-use `.md` files.

### Key Features
* **Variable Injection:** Define your data once in the YAML frontmatter and reuse it throughout your document using the `{{ variable }}` syntax.
* **Clean Separation:** Keep your data (variables) and your structure (content) separate for better maintainability.
* **Lightweight Compiler:** A fast, Node-based compiler to a standard Markdown file.
* **IntelliSense Support:** A dedicated VSIX extension for Visual Studio Code that provides syntax highlighting for `.emd` files, ensuring your variables and frontmatter are always readable and error-free. 

![Intellisense in action](https://github.com/RoeiMeiri9/templatemd/blob/master/vscode%20extension/branding/tmd.gif)

### Getting Started

To start using **ExtendedMD** in your project, follow these simple steps:

#### 1. Install the CLI
Install the core processor globally or as a dev dependency:
```bash
npm install -g extendedmd
```

#### 2. Start the Compiler
Run the compiler in watch mode to automatically transform your `.emd` files into `.md`:
```bash
extendedmd --watch .
```

#### 3. Enhance your Editor (VS Code)
For the best experience, including syntax highlighting and IntelliSense, install the **ExtendedMD VSIX** extension.

### How it Works
1. **Write:** Create an `.emd` file with a YAML header containing your `variables`.
2. **Compile:** Run the EMD parser to parse your logic.

## Release Notes

### 1.0.0

Initial release of ExtendedMD

## License

This project is licensed under the [MIT License](./vscode%20extension/LICENSE).



