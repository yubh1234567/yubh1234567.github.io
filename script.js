const PROFILE = {
  alias: "byeongPR0",
  githubUrl: "https://github.com/yubh1234567",
};

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
      <a class="post-content" href="${post.url}">
        <h4>${post.title}</h4>
        <p>${post.summary}</p>
        <div class="post-tags" aria-label="태그">
          ${post.tags.map((tag) => `<span class="post-tag">#${tag}</span>`).join("")}
        </div>
      </a>
      <a class="post-arrow" href="${post.url}" aria-label="${post.title} 읽기">↗</a>
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
          return `<a class="search-result" href="${post.url}"><small>${category.title} · ${post.date}</small><strong>${post.title}</strong></a>`;
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
