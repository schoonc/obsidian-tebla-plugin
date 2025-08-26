import { writeFileSync } from "fs";
import { fromProject } from "./internal/fromProject";
import { getDockerfile } from "./internal/getDockerfile";

const dockerfile = getDockerfile()
writeFileSync(fromProject("Dockerfile"), dockerfile);
