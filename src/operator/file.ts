import fs from "fs";

export function readFile(path: string) {
  try {
    const content = fs.readFileSync(path, "utf8");
    return { success: true, content };
  } catch (err: any) {
    return { success: false, error: err.toString() };
  }
}

export function writeFile(path: string, content: string) {
  try {
    fs.writeFileSync(path, content);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.toString() };
  }
}

export function patchFile(path: string, patch: { target: string; replace: string }) {
  try {
    let content = fs.readFileSync(path, "utf8");
    content = content.replace(patch.target, patch.replace);
    fs.writeFileSync(path, content);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.toString() };
  }
}
