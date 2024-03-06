import 'src/dotenv-config'
import { expand } from 'dotenv-expand'
import { resolve } from 'path'
import { config } from 'dotenv'

const filePath = resolve(process.cwd(), '.env.test')
expand(
  config({
    path: filePath,
  }),
)
export {}
