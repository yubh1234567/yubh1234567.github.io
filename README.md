# 유병현 보안 일지

Knights Frontier 3기 첫 번째 미션을 위해 만든 GitHub Pages용 개인 기술 블로그입니다. 차량 보안 연구자의 필드 노트를 콘셉트로 삼아 기록의 위계와 가독성을 중심으로 구성했습니다.
별도 빌드 도구 없이 HTML, CSS, JavaScript만 사용하므로 저장소에 올린 뒤 바로 배포할 수 있습니다.

## 1. 내 정보로 바꾸기

아래 항목을 먼저 수정하세요.

- `index.html`: 소개 문장, 자기소개, 연락 안내
- `script.js`의 `PROFILE.githubUrl`: 본인 GitHub 주소
- `script.js`의 `posts`: 글 제목, 요약, 태그, 링크
- `assets/favicon.svg`: 사이트 아이콘
- `DESIGN.md`: 글꼴, 색상, 문구, 레이아웃 기준

새 글을 별도 HTML 문서로 작성했다면 `posts` 항목의 `url`을 해당 파일 경로로 바꾸고
`draft: false`로 설정하면 됩니다.

## 2. 로컬에서 확인하기

단순히 `index.html`을 브라우저에서 열어도 동작합니다. 로컬 서버를 사용하려면:

```powershell
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## 3. GitHub Pages에 배포하기

### 사용자 사이트 (`username.github.io`) 방식

1. GitHub에서 `본인아이디.github.io`라는 이름의 Public 저장소를 만듭니다.
2. 이 폴더의 모든 파일을 해당 저장소에 올립니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment**의 Source를 **Deploy from a branch**로 선택합니다.
5. Branch를 `main`, 폴더를 `/(root)`로 선택하고 저장합니다.
6. 잠시 뒤 `https://본인아이디.github.io`에서 블로그를 확인합니다.

### 프로젝트 사이트 방식

저장소 이름을 자유롭게 만든 경우 주소는 `https://본인아이디.github.io/저장소이름/`이 됩니다.
이 사이트는 상대 경로를 사용하므로 두 방식 모두에서 정상 동작합니다.

## 카테고리

미션 요구사항에 맞춰 다음 6개 카테고리를 구성했습니다.

1. 개발
2. CTF / Wargame
3. Bug Bounty
4. 블로그 / 기술문서
5. 논문 / 컨퍼런스
6. 공모전 / 자격증

## 파일 구조

```text
.
├── index.html          # 페이지 구조와 소개 문구
├── styles.css          # 반응형 디자인과 테마
├── script.js           # 카테고리, 글 데이터, 검색/필터 기능
├── post.css            # 기술 글 페이지 공통 디자인
├── post.js             # 기술 글 읽기 진행률
├── posts/
│   └── github-pages-start.html # 첫 번째 구축 기록
├── assets/
│   └── favicon.svg     # 사이트 아이콘
├── .nojekyll           # GitHub Pages의 Jekyll 처리 비활성화
└── README.md           # 개인화 및 배포 안내
```
