import { writeFileSync } from "fs";
import { fromProject } from "./internal/fromProject";
import { getDockerfile } from "./internal/getDockerfile";
import { getManifest } from "./internal/getManifest";

/* When updating the minimum version, you need to:
1. Update the Node.js version in the image (which one - you can check in the inspector of the running Obsidian - `process.versions.node`)
2. Update the version of `@types/node` (it seems like the major.minor of `@types/node` should match the major.minor of Node.js)
3. Update the `target` version in `tsconfig.json` (which one - you can check in the inspector of the running Obsidian - `process.versions.chrome`
   and then check on [caniuse](https://caniuse.com) which ECMA version is supported by the specified Chrome.) */

const newMinAppVersion = process.argv[2]

if (!newMinAppVersion) {
    throw new Error('Please, specify new minAppVersion')
}

const dockerfile = getDockerfile(newMinAppVersion)
writeFileSync(fromProject("Dockerfile"), dockerfile);

const manifest = getManifest(newMinAppVersion)
writeFileSync(fromProject("manifest.json"), JSON.stringify(manifest, null, "\t"));
