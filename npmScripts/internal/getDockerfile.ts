import { getManifest } from "./getManifest"

/* To get the Node.js version that Obsidian is running on, you can execute process.versions.node in the inspector. */
const OBSIDIAN_VERSION_TO_NODE_VERSION: Record<string,string> = {
    '1.9.12': '20.18.2',
}

export const getDockerfile = (minAppVersion?: string) => {
    if (!minAppVersion) {
        minAppVersion = getManifest().minAppVersion
    }

    const nodeVersion = OBSIDIAN_VERSION_TO_NODE_VERSION[minAppVersion]

    if (!nodeVersion) {
        throw new Error('No such version')
    }

    const text = `# syntax=docker/dockerfile:1.7-labs

# The syntax above is required to enable --parents flag support in the COPY instruction.

# Similar config: https://github.com/BretFisher/node-docker-good-defaults/blob/de1bfbadc3f50ad402beb935ba621906f36acb5e/Dockerfile

FROM node:${nodeVersion}-slim AS base

# Sometimes when debugging in a container, you need ps (process status), which is not available in the slim version. You can switch to this (image) for debugging.
#FROM node:${nodeVersion} AS base

# Let's install the latest npm with fixed bugs.
RUN npm i npm@latest -g

# It only affects RUN, ENTRYPOINT, and CMD instructions, and this user will be the default when entering the container. For COPY, you need to use --chown=node:node.
USER node

# We will install the dependencies in /opt/nodeApp, and the development container will move them to /opt/nodeApp/app.
# This is a hack to make the node_modules folder appear on the host during development, so that the editor can see the dependencies for imports, etc.
WORKDIR /opt/nodeApp

COPY --chown=node:node --parents \\
    package.json \\
    package-lock.json \\
    ./

FROM base AS dev
ENV NODE_ENV=development
RUN npm ci && npm cache clean --force

# For convenience of debugging after the build (docker run -it --rm obsidian-tebla-plugin-dev:latest /bin/bash)
WORKDIR /opt/nodeApp/app
COPY --chown=node:node . .
`

    return text
}
