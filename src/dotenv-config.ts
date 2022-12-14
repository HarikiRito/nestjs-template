import { existsSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envs = [`.env.${process.env.NODE_ENV}`, '.env']

envs.map((file) => {
  const filePath = resolve(process.cwd(), file)
  if (existsSync(filePath)) {
    expand(config({ path: filePath }))
  }
})
