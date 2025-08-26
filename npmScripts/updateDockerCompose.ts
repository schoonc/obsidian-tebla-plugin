import * as fs from 'fs'
import * as YAML from 'yaml'
import { fromProject } from './internal/fromProject'
import { getDockerCompose } from './internal/getDockerCompose'

const dockerCompose = getDockerCompose()
fs.writeFileSync(fromProject('docker-compose.yml'), YAML.stringify(dockerCompose))