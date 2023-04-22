"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DeployZip {
    // RUN_ENV: string;
    // constructor() {
    //   this.RUN_ENV = process.env.RUN_ENV ? process.env.RUN_ENV : "dev";
    // }
    static run = async () => {
        const deployZip = new DeployZip();
        const packageJsonPath = path_1.default.join(__dirname, "../../package.json");
        const manifestJsonPath = path_1.default.join(__dirname, "../../public/manifest.json");
        const manifestOutputPath = path_1.default.join(__dirname, "../../dist/manifest.json");
        const version = await deployZip.syncManifestVersion(packageJsonPath, manifestJsonPath, manifestOutputPath);
        const doCompressFolderPath = path_1.default.join(__dirname, "../../dist");
        const zipOutputPath = path_1.default.join(__dirname, `../../deploy/app_${version}-${process.env.RUN_ENV ? process.env.RUN_ENV : "dev"}.zip`);
        deployZip.compressZip(doCompressFolderPath, zipOutputPath);
    };
    syncManifestVersion = async (packageJsonPath, manifestJsonPath, manifestOutputPath) => {
        const packageVersion = await fs_1.default.promises
            .readFile(packageJsonPath, { encoding: "utf-8" })
            .then(JSON.parse)
            .then(({ version }) => version);
        const newManifest = await fs_1.default.promises
            .readFile(manifestJsonPath, { encoding: "utf-8" })
            .then(JSON.parse)
            .then((data) => ({ ...data, version: packageVersion }));
        await fs_1.default.promises.writeFile(manifestJsonPath, JSON.stringify(newManifest));
        await fs_1.default.promises.writeFile(manifestOutputPath, JSON.stringify(newManifest));
        return packageVersion;
    };
    compressZip = (folderPath, outputPath) => {
        const zip = new adm_zip_1.default();
        zip.addLocalFolder(folderPath);
        zip.writeZip(outputPath);
    };
}
DeployZip.run();
//# sourceMappingURL=deploy.zip.script.js.map