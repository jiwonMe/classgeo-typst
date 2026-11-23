# ClassGeo for Typst

Typst 문서의 ClassGeo DSL을 SVG로 렌더링합니다. GitHub에서 배포하는 **로컬 패키지**이며 Typst Universe 패키지가 아닙니다. Typst CLI 0.15 이상, Node.js 22 이상이 필요합니다.

~~~sh
git clone --branch v0.1.0 --depth 1 https://github.com/jiwonMe/classgeo-typst.git
cd classgeo-typst
node install.mjs
node prepare.mjs example.typ example.classgeo.json
typst compile example.typ
~~~

설치기는 Typst의 사용자 패키지 경로(`TYPST_PACKAGE_PATH`로 변경 가능)에 패키지를 복사합니다. 공개된 [KiceDraw CLI](https://github.com/jiwonMe/kicedraw-skills)를 고정 커밋에서 받아 SHA-256을 검증한 뒤 설치기 옆에 둡니다. 별도 npm 설치는 필요 없습니다.

다른 문서에서는 다음과 같이 사용하세요:

~~~typst
#import "@local/classgeo:0.1.0": classgeo
#classgeo(read("triangle.dsl"), cache: path("diagrams.json"), width: 60mm, alt: "삼각형 ABC")
~~~

문서 디렉터리에서 `node /path/to/classgeo-typst/prepare.mjs main.typ diagrams.json`을 실행하고 `typst compile main.typ`로 조판하세요. DSL을 수정하면 캐시를 다시 생성해야 합니다. 캐시를 함께 배포하면 패키지가 설치된 환경에서는 Node.js 없이 조판할 수 있습니다. 인라인 DSL 예시는 [example.typ](example.typ)에 있습니다.
