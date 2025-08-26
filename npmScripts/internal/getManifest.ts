import { readFileSync } from "fs";
import { fromProject } from "./fromProject";

export const getManifest = (minAppVersion?: string): {minAppVersion: string} => {
    let manifest = JSON.parse(readFileSync(fromProject("manifest.json"), "utf8"));
    return {
        ...manifest,
        minAppVersion: minAppVersion ?? manifest.minAppVersion,
    }
}