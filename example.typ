#import "@local/classgeo:0.1.0": classgeo
#let diagram = classgeo.with(cache: path("example.classgeo.json"))

#figure(diagram(width: 60mm, alt: "Triangle ABC", ```classgeo
A: FreePoint(0, 0)
B: FreePoint(4, 0)
C: FreePoint(2, 3)
AB: Segment(A -> B)
BC: Segment(B -> C)
CA: Segment(C -> A)
```), caption: [Triangle ABC])
