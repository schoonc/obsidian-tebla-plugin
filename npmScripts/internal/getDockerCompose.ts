export const getDockerCompose = () => {
    return {
        services: {
            app: {
                build: {
                    context: './',
                    dockerfile: './Dockerfile',
                },
                container_name: 'obsidian-tebla-plugin-dev',
                volumes: [
                    '.:/opt/nodeApp/app'
                ],
                environment: {
                    // Update PATH
                    PATH: `/opt/nodeApp/app/node_modules/.bin:$PATH`
                },
                // On the first container startup, /opt/nodeApp/node_modules exists and will be moved to /opt/nodeApp/app
                // During subsequent startups - it will not be moved.
                command: 'sh -c "[ -d /opt/nodeApp/node_modules ] && rm -rf /opt/nodeApp/app/node_modules && mv /opt/nodeApp/node_modules /opt/nodeApp/app; node esbuild.config.mjs"'
            },
        },
    }
}