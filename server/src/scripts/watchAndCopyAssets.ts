import path from "path";
import chokidar from "chokidar";
import fs from "fs";
import fsExtra from "fs-extra";
import { buildDirectory, rootDirectoryPath } from "../config";

const watchAndCopyAssets = () => {
    const assetsSrcPath = path.join(rootDirectoryPath, "app/src", "assets");
    const assetsDistPath = path.join(
        rootDirectoryPath,
        buildDirectory,
        "assets"
    );

    const watcher = chokidar.watch(`${assetsSrcPath}/**/*`, {
        ignored: /\.DS_Store$/,
        persistent: true,
    });

    const copyFile = (srcPath: string) => {
        const targetPath = srcPath.replace(assetsSrcPath, assetsDistPath);
        fsExtra
            .copy(srcPath, targetPath)
            .then(() => console.log(`Copied ${srcPath} to ${targetPath}`))
            .catch((err) => console.error(`Error copying ${srcPath}:`, err));
    };

    const removeFile = (srcPath: string) => {
        const targetPath = srcPath.replace(assetsSrcPath, assetsDistPath);
        fs.unlink(targetPath, (err) => {
            if (err) {
                console.error(`Error while deleting the file: ${err.message}`);
                return;
            }

            console.log(`File ${targetPath} deleted successfully`);
        });
    };

    watcher
        .on("add", (path) => {
            console.log(`File ${path} has been added`);
            copyFile(path);
        })
        .on("change", (path) => {
            console.log(`File ${path} has been changed`);
            copyFile(path);
        })
        .on("unlink", (path) => {
            console.log(`File ${path} has been removed`);
            removeFile(path);
        });
};

export default watchAndCopyAssets;
