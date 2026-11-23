import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

test('collect, render, compile and reject a stale cache', async (t) => {
  const cwd = await mkdtemp(join(tmpdir(), 'classgeo-typst-'))
  t.after(() => rm(cwd, { recursive: true, force: true }))
  for (const name of ['lib.typ', 'example.typ']) {
    await cp(new URL(name, import.meta.url), join(cwd, name))
  }
  const cache = 'example.classgeo.json'
  execFileSync(process.execPath, [fileURLToPath(new URL('prepare.mjs', import.meta.url)), 'example.typ', cache], { cwd })
  const diagrams = JSON.parse(await readFile(join(cwd, cache), 'utf8'))
  assert.equal(Object.keys(diagrams).length, 1)
  assert.match(Object.values(diagrams)[0], /<svg\b/)
  const compile = () => execFileSync('typst', ['compile', 'example.typ'], { cwd, stdio: 'pipe' })
  compile()
  await writeFile(join(cwd, cache), '{}')
  assert.throws(compile, /DSL changed/)
})
