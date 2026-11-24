const PROFILE = {
  alias: "byeongPR0",
  githubUrl: "https://github.com/yubh1234567",
};

const ARTICLE_REVISION = "20261124-eip4-human1-evse1-title1";

function postHref(post) {
  if (post.draft || !post.url.startsWith("posts/")) return post.url;
  const separator = post.url.includes("?") ? "&" : "?";
  return `${post.url}${separator}v=${ARTICLE_REVISION}`;
}

const categories = [
  { id: "development", number: "01", title: "개발", subtitle: "차량 보안 · AI 활용" },
  { id: "ctf", number: "02", title: "CTF / Wargame", subtitle: "문제 풀이 · 회고" },
  { id: "bug-bounty", number: "03", title: "Bug Bounty", subtitle: "취약점 분석 · 방법론" },
  { id: "docs", number: "04", title: "블로그 / 기술문서", subtitle: "기술 메모 · 작성 기준" },
  { id: "research", number: "05", title: "논문 / 컨퍼런스", subtitle: "논문 · 발표 기록" },
  { id: "certification", number: "06", title: "공모전 / 자격증", subtitle: "준비 과정 · 회고" },
];

// 새 글을 공개할 때 문서 경로를 url에 넣고 draft를 false로 바꿉니다.
const posts = [
  {
    category: "docs",
    date: "2026.11.24",
    title: "회고 2026-11-24",
    summary: "블로그와 기술 문서, EVSE CTF 문제 제작과 블랙박스 CLI 검증 경험을 돌아보고 기초와 실습을 채울 다음 2주를 계획했다.",
    tags: ["회고", "나이츠 프런티어", "학습 계획"],
    url: "posts/security-learning-retrospective.html",
    draft: false,
  },
  {
    category: "research",
    date: "2026.11.24",
    title: "AI가 일을 끝냈다는 말을 어디까지 믿을까",
    summary: "DEF CON 34 〈Hacking AI〉를 보고, AI가 목표를 달성한 과정에서 무엇을 확인해야 하는지와 규칙의 빈틈을 고치는 책임을 생각해 봤다.",
    tags: ["DEF CON 34", "AI 보안", "컨퍼런스 리뷰"],
    url: "posts/defcon-34-hacking-ai.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.24",
    title: "EIP를 읽기 전에: 이더리움의 기본 언어",
    summary: "EIP 문서를 처음 열었을 때 이더리움과 ETH의 차이부터 막혔다. 지갑·서명·가스비처럼 자주 만나는 말을 ETH 송금 순서에 맞춰 정리했다.",
    tags: ["Ethereum", "Blockchain", "입문"],
    url: "posts/ethereum-basics-before-eips.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.24",
    title: "EIP-1559: 가스비를 예측 가능한 규칙으로",
    summary: "예측하기 어려웠던 수수료 경매를 기본요금·팁·최대 한도로 바꾼 원리와 실제 비용 계산, 소각과 한계를 살펴본다.",
    tags: ["Ethereum", "EIP-1559", "Gas"],
    url: "posts/eip-1559-fee-market.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.24",
    title: "ERC-2612: 토큰 사용 허가를 서명으로 바꾸다",
    summary: "토큰 사용 허가인 approve의 불편을 지갑 서명으로 줄이는 permit의 흐름과 Uniswap V2의 실제 사용 사례를 살펴본다.",
    tags: ["Ethereum", "ERC-2612", "Permit"],
    url: "posts/eip-2612-permit.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.24",
    title: "ERC-4337: 지갑을 프로그램으로 만드는 계정 추상화",
    summary: "UserOperation·Bundler·EntryPoint·Paymaster가 복구·묶음 실행·가스비 대납이 가능한 스마트 계정을 만드는 흐름을 살펴본다.",
    tags: ["Ethereum", "ERC-4337", "Account Abstraction"],
    url: "posts/erc-4337-account-abstraction.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.18",
    title: "암호 체계 실패",
    summary: "OWASP Top 10:2025와 A04 암호 체계 실패를 통해 비밀번호 저장, HTTPS, 키 관리와 보안 난수의 원리를 쉽게 살펴본다.",
    tags: ["OWASP", "Cryptography", "Application Security"],
    url: "posts/owasp-cryptographic-failures.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.18",
    title: "IDS와 IPS는 공격을 어떻게 찾아내고 막는가",
    summary: "침입 탐지부터 차단까지 어떤 판단이 일어날까? IDS와 IPS의 원리, 유형, 차이와 안전한 운영 방법을 정리한다.",
    tags: ["IDS", "IPS", "Network Security"],
    url: "posts/ids-ips-guide.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.18",
    title: "쏘카 개인정보 유출 사건",
    summary: "쏘카의 내부용 회원 조회 기능에 대한 외부 공격으로 고객 248명의 정보가 유출됐다. 사고의 흐름과 접근 권한, 대응과 남은 과제를 쉽게 살펴본다.",
    tags: ["보안 사고", "차량 보안", "개인정보"],
    url: "posts/socar-member-data-breach.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.18",
    title: "Intoxalock 사이버공격과 시동 제한 사고",
    summary: "회사 시스템에 대한 사이버공격으로 정기 점검 업무가 중단돼 일부 운전자가 차를 쓰지 못한 서비스 가용성 사고.",
    tags: ["보안 사고", "차량 보안", "Availability"],
    url: "posts/intoxalock-cyberattack.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.10",
    title: "DoFun 차량용 안드로이드 악성코드 감염 사건",
    summary: "정상 업데이트 앱으로 악성코드가 설치돼 차량용 기기가 공격자 대신 인터넷 요청을 보낸 사건. 봇넷 감염의 과정과 의미를 쉽게 풀었다.",
    tags: ["보안 사고", "차량 보안", "IVI"],
    url: "posts/dofun-head-unit-botnet.html",
    draft: false,
  },
  {
    category: "bug-bounty",
    date: "2026.11.10",
    title: "무작위 입력은 어떻게 취약점을 찾는가",
    summary: "퍼징의 동작 원리와 분류 기준, AFL++부터 Fuzzilli까지 대표 퍼저 8종의 차이와 선택법.",
    tags: ["Fuzzing", "Fuzzer", "Bug Bounty"],
    url: "posts/fuzzer-and-fuzzing.html",
    draft: false,
  },
  {
    category: "research",
    date: "2026.11.10",
    title: "차량의 안드로이드가 해킹당해도, 제어권은 지킬 수 있을까",
    summary: "USENIX Security 2025 Harness로 살펴본 AAOS 차량 제어의 신뢰 경계와 격리 설계.",
    tags: ["차량 보안", "Android Automotive", "논문 리뷰"],
    url: "posts/harness-aaos.html",
    draft: false,
  },
  {
    category: "docs",
    date: "2026.11.09",
    title: "행복을 찾아가는 과정에서",
    summary: "나의 세 가지 선택 기준과 나이츠 프런티어에서 찾고 싶은 답.",
    tags: ["가치관", "나이츠 프런티어", "성장"],
    url: "posts/my-values-and-frontier.html",
    draft: false,
  },
  {
    category: "development",
    date: "2026.10.29",
    title: "GitHub Pages 개인 기술 블로그 구축",
    summary: "저장소 구성부터 정적 사이트 배포까지 정리한 첫 구축 기록.",
    tags: ["GitHub Pages", "HTML", "CSS"],
    url: "posts/github-pages-start.html",
    draft: false,
  },
  {
    category: "development",
    date: "준비 중",
    title: "차량 통신과 CAN 기초",
    summary: "차량 네트워크 학습을 위한 CAN 통신의 구조와 기본 개념.",
    tags: ["차량 보안", "CAN"],
    url: "#archive",
    draft: true,
  },
  {
    category: "ctf",
    date: "준비 중",
    title: "첫 Wargame 풀이",
    summary: "풀이 과정과 실패한 접근, 문제 해결의 핵심 개념.",
    tags: ["Wargame", "Write-up"],
    url: "#archive",
    draft: true,
  },
  {
    category: "bug-bounty",
    date: "준비 중",
    title: "웹 취약점 점검 흐름",
    summary: "정찰부터 보고서 작성까지 이어지는 반복 가능한 점검 흐름.",
    tags: ["Bug Bounty", "Methodology"],
    url: "#archive",
    draft: true,
  },
  {
    category: "docs",
    date: "준비 중",
    title: "재현 가능한 기술 기록",
    summary: "다시 읽었을 때 같은 결과를 확인할 수 있는 기술 기록의 조건.",
    tags: ["Documentation", "Blog"],
    url: "#archive",
    draft: true,
  },
  {
    category: "research",
    date: "준비 중",
    title: "보안 논문 읽기 메모",
    summary: "문제 정의, 핵심 기여, 한계를 중심으로 구성한 논문 읽기 기록.",
    tags: ["Paper", "Research"],
    url: "#archive",
    draft: true,
  },
  {
    category: "certification",
    date: "준비 중",
    title: "자격증 준비 기록",
    summary: "공모전과 자격증 준비 과정, 이후 학습을 위한 회고.",
    tags: ["Challenge", "Certificate"],
    url: "#archive",
    draft: true,
  },
];

const publishedPosts = posts.filter((post) => !post.draft);
const categoryGrid = document.querySelector("#categoryGrid");
const postList = document.querySelector("#postList");
const filterReset = document.querySelector("#filterReset");
const emptyState = document.querySelector("#emptyState");
const searchDialog = document.querySelector("#searchDialog");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");

function categoryById(id) {
  return categories.find((category) => category.id === id);
}

function renderCategories() {
  categoryGrid.innerHTML = categories
    .map((category) => {
      const count = publishedPosts.filter((post) => post.category === category.id).length;
      return `
        <button class="category-item" type="button" data-category="${category.id}" aria-pressed="false">
          <span class="category-topline">
            <span class="category-index">NODE_${category.number}</span>
            <span class="category-count" aria-label="공개 기록 ${count}개">${String(count).padStart(2, "0")}</span>
          </span>
          <span class="category-copy">
            <span class="category-title">${category.title}</span>
            <span class="category-description">${category.subtitle}</span>
          </span>
        </button>
      `;
    })
    .join("");

  categoryGrid.querySelectorAll(".category-item").forEach((button) => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
  });
}

function postTemplate(post) {
  const category = categoryById(post.category);
  return `
    <article class="post-item">
      <div class="post-meta">
        <span class="post-category">${category.title}</span>
        <time>${post.date}</time>
      </div>
      <a class="post-content" href="${postHref(post)}">
        <h4>${post.title}</h4>
        <p>${post.summary}</p>
        <div class="post-tags" aria-label="태그">
          ${post.tags.map((tag) => `<span class="post-tag">#${tag}</span>`).join("")}
        </div>
      </a>
      <a class="post-arrow" href="${postHref(post)}" aria-label="${post.title} 읽기">↗</a>
    </article>
  `;
}

function renderPosts(items = publishedPosts) {
  postList.innerHTML = items.map(postTemplate).join("");
  emptyState.hidden = items.length !== 0;
}

function setCategory(categoryId) {
  const filteredPosts = publishedPosts.filter((post) => post.category === categoryId);
  renderPosts(filteredPosts);
  filterReset.hidden = false;

  categoryGrid.querySelectorAll(".category-item").forEach((button) => {
    const isActive = button.dataset.category === categoryId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelector(".archive-heading").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetCategory() {
  renderPosts();
  filterReset.hidden = true;
  categoryGrid.querySelectorAll(".category-item").forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
}

function openSearch() {
  if (!searchDialog.open) searchDialog.showModal();
  window.setTimeout(() => searchInput.focus(), 50);
}

function renderSearchResults(query) {
  const term = query.trim().toLocaleLowerCase("ko");
  if (!term) {
    searchResults.innerHTML = "<p>검색어를 입력하면 공개된 기록을 찾습니다.</p>";
    return;
  }

  const matches = publishedPosts.filter((post) => {
    const category = categoryById(post.category);
    return [post.title, post.summary, category.title, ...post.tags]
      .join(" ")
      .toLocaleLowerCase("ko")
      .includes(term);
  });

  searchResults.innerHTML = matches.length
    ? matches
        .map((post) => {
          const category = categoryById(post.category);
          return `<a class="search-result" href="${postHref(post)}"><small>${category.title} · ${post.date}</small><strong>${post.title}</strong></a>`;
        })
        .join("")
    : "<p>일치하는 공개 기록이 없습니다.</p>";

  searchResults.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => searchDialog.close());
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("bpr0-theme", theme);
  document.querySelector(".theme-toggle").setAttribute(
    "aria-label",
    theme === "dark" ? "기본 테마로 전환" : "고대비 테마로 전환",
  );
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#01040a" : "#050a12";
}

function setupTheme() {
  const savedTheme = localStorage.getItem("bpr0-theme") || "light";
  applyTheme(savedTheme);
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-nav");

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "모바일 메뉴 열기");
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
  };

  toggle.addEventListener("click", () => {
    const willOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.setAttribute("aria-label", willOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기");
    menu.classList.toggle("open", willOpen);
    menu.setAttribute("aria-hidden", String(!willOpen));
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

function updateScrollState() {
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const percent = `${(window.scrollY / scrollable) * 100}%`;
  document.documentElement.style.setProperty("--page-progress", percent);
  document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 8);
}

renderCategories();
renderPosts();
setupTheme();
setupMobileMenu();
updateScrollState();

document.querySelector("#githubLink").href = PROFILE.githubUrl;
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector(".search-trigger").addEventListener("click", openSearch);
filterReset.addEventListener("click", resetCategory);
searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchDialog.open) {
    event.preventDefault();
    searchDialog.close();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
});
