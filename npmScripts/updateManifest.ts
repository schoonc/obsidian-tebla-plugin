import { writeFileSync } from "fs";
import { fromProject } from "./internal/fromProject";
import { getManifest } from "./internal/getManifest";

const manifest = getManifest()
writeFileSync(fromProject("manifest.json"), JSON.stringify(manifest, null, "\t"));
