import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

async function prepare(input, output) {
  if (resolve(input) === resolve(output) || !output.endsWith('.json')) throw Error('Choose a separate .json file for the SVG cache')
  const sources = JSON.parse(execFileSync('typst', [
    'eval', '--in', input, '--input', 'classgeo-collect=1',
    'query(<classgeo-source>).map(it => it.value)',
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }))
  const cache = Object.create(null)
  const tmp = await mkdtemp(join(tmpdir(), 'classgeo-svg-'))
  try {
    const cli = process.env.KICEDRAW_CLI || fileURLToPath(new URL('kicedraw.mjs', import.meta.url))
    for (const dsl of new Set(sources)) {
      const src = join(tmp, 'input.dsl'), svg = join(tmp, 'output.svg')
      await writeFile(src, dsl)
      execFileSync(process.execPath, [cli, 'svg', src, svg], { stdio: 'inherit' })
      cache[dsl] = await readFile(svg, 'utf8')
    }
    await writeFile(output, JSON.stringify(cache))
  } finally {
    await rm(tmp, { recursive: true, force: true })
  }
}

try {
  if (process.argv.length !== 4) throw Error('Usage: node prepare.mjs document.typ diagrams.classgeo.json')
  await prepare(...process.argv.slice(2))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
