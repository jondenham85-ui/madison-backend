import executeCode from "./execute";
import { readFile, writeFile, patchFile } from "./file";
import deploy from "./deploy";
import runTask from "./task";

export default {
  runTask,
  executeCode,
  readFile,
  writeFile,
  patchFile,
  deploy
};
