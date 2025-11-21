import { load } from "js-yaml";
import { readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises";
export async function readFile(path) {
    try {
        const content = await fsReadFile(path, "utf-8");
        await writeFile(path, parseFile(content));
    }
    catch (err) {
        console.error("Error reading file:", err);
    }
}
async function writeFile(path, content) {
    if (!content)
        return;
    try {
        let fileTypeIndex = path.lastIndexOf(".tmd");
        fsWriteFile(path.substring(0, fileTypeIndex) + ".md", content, "utf-8");
    }
    catch (err) {
        console.error("Error writing to file:", err);
    }
}
function parseFile(content) {
    const fmMatch = content.match(/^---\r\n([\s\S]*?)\r\n---\r\n/);
    if (!fmMatch || !fmMatch[1])
        return;
    const fmContent = fmMatch[1];
    let vars;
    try {
        vars = load(fmContent);
    }
    catch {
        return;
    }
    if (!vars || !vars.variables)
        return;
    vars = vars.variables;
    let newContent = content;
    for (let variable of Object.keys(vars)) {
        newContent = newContent.replaceAll(`{{${variable}}}`, `${vars[variable]}`);
    }
    return newContent.replace(fmMatch[0], "");
}
//# sourceMappingURL=parser.js.map