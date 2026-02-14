# Flappy Bird PlayCanvas Stack Info

해당 애플리케이션은 **PlayCanvas** 엔진을 사용하여 개발된 웹 기반 게임입니다.

## 기술 스택 요약

| 구성 요소 | 기술 |
| :--- | :--- |
| **게임 엔진** | [PlayCanvas](https://playcanvas.com/) (WebGL 기반) |
| **렌더링** | WebGL |
| **스크립트 언어** | JavaScript (ES5/ES6+) |
| **데이터 포맷** | JSON (설정 및 씬 데이터) |
| **리소스** | HTML5, CSS3, PNG (스프라이트), MP3 (사운드) |

## 주요 파일 구성

- `playcanvas-stable.min.js`: PlayCanvas 게임 엔진 코어
- `__game-scripts.js`: 게임 로직 및 커스텀 스크립트
- `config.json`: 에셋 및 프로젝트 설정 정보
- `assets/`: 게임에 사용된 이미지, 사운드, 씬 데이터 등의 리소스 폴더

## 실행 방법
이 데이터는 PlayCanvas 플랫폼에서 빌드된 결과물입니다. 로컬에서 실행하려면 웹 서버(예: `python -m http.server`)를 통해 `index.html`을 구성하여 로드해야 합니다.
