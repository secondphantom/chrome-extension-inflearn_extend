import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

class DeployZip {
  // RUN_ENV: string;

  // constructor() {
  //   this.RUN_ENV = process.env.RUN_ENV ? process.env.RUN_ENV : "dev";
  // }

  static run = async () => {
    const deployZip = new DeployZip();

    const packageJsonPath = path.join(__dirname, "../../package.json");
    const manifestJsonPath = path.join(__dirname, "../../public/manifest.json");
    const manifestOutputPath = path.join(__dirname, "../../dist/manifest.json");
    const version = await deployZip.syncManifestVersion(
      packageJsonPath,
      manifestJsonPath,
      manifestOutputPath
    );

    const doCompressFolderPath = path.join(__dirname, "../../dist");
    const zipOutputPath = path.join(
      __dirname,
      `../../deploy/app_${version}-${
        process.env.RUN_ENV ? process.env.RUN_ENV : "dev"
      }.zip`
    );

    deployZip.compressZip(doCompressFolderPath, zipOutputPath);
  };

  syncManifestVersion = async (
    packageJsonPath: string,
    manifestJsonPath: string,
    manifestOutputPath: string
  ) => {
    const packageVersion = await fs.promises
      .readFile(packageJsonPath, { encoding: "utf-8" })
      .then(JSON.parse)
      .then(({ version }) => version);
    const newManifest = await fs.promises
      .readFile(manifestJsonPath, { encoding: "utf-8" })
      .then(JSON.parse)
      .then((data) => ({ ...data, version: packageVersion }));
    await fs.promises.writeFile(manifestJsonPath, JSON.stringify(newManifest));
    await fs.promises.writeFile(
      manifestOutputPath,
      JSON.stringify(newManifest)
    );

    return packageVersion;
  };

  compressZip = (folderPath: string, outputPath: string) => {
    const zip = new AdmZip();

    zip.addLocalFolder(folderPath);
    zip.writeZip(outputPath);
  };
}

DeployZip.run();
