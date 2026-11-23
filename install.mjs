import { createHash } from 'node:crypto'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'

const data = platform() === 'darwin' ? join(homedir(), 'Library/Application Support')
  : platform() === 'win32' ? process.env.APPDATA : process.env.XDG_DATA_HOME || join(homedir(), '.local/share')
const dest = join(process.env.TYPST_PACKAGE_PATH || join(data, 'typst/packages'), 'local/classgeo/0.1.0')
const url = 'https://raw.githubusercontent.com/jiwonMe/kicedraw-skills/33df2a02bcb21e5e0d69978b7e104d0c3388b731/skills/kicedraw/bin/kicedraw.mjs'
const response = await fetch(url)
if (!response.ok) throw Error(`KiceDraw download failed: ${response.status}`)
const cli = Buffer.from(await response.arrayBuffer())
if (createHash('sha256').update(cli).digest('hex') !== '9674f7bae3017d36a0dc84e8a79d668e15ff309f0c43b215be4bbe6c1e852296') throw Error('KiceDraw checksum mismatch')
await mkdir(dest, { recursive: true })
for (const name of ['typst.toml', 'lib.typ']) await copyFile(new URL(name, import.meta.url), join(dest, name))
await writeFile(new URL('kicedraw.mjs', import.meta.url), cli)
console.log(`Installed @local/classgeo:0.1.0 in ${dest}`)
