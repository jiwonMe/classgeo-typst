// Pass a path from the document so the cache resolves relative to its caller.
#let classgeo(source, cache: none, width: auto, alt: none) = {
  let dsl = if type(source) == content and source.func() == raw { source.text } else { source }
  assert(type(dsl) == str, message: "classgeo: expected DSL text or a raw block")
  if sys.inputs.at("classgeo-collect", default: "0") == "1" {
    [#metadata(dsl) <classgeo-source>]
  } else {
    assert(type(cache) == path, message: "classgeo: pass cache: path(\"diagrams.classgeo.json\")")
    let diagrams = json(cache)
    assert(dsl in diagrams, message: "classgeo: DSL changed; run prepare.mjs again")
    image(bytes(diagrams.at(dsl)), format: "svg", width: width, alt: alt)
  }
}
