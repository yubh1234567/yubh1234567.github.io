/**
 * 빠른 개인화: 아래 PROFILE 값만 본인 정보로 바꾸면 됩니다.
 */
const PROFILE = {
  githubUrl: "https://github.com/",
};

const categories = [
  { id: "development", number: "01", title: "개발", subtitle: "차량 보안과 개발 공부", icon: "DEV", color: "blue" },
  { id: "ctf", number: "02", title: "CTF / Wargame", subtitle: "문제 풀이와 회고", icon: "CTF", color: "blue" },
  { id: "bug-bounty", number: "03", title: "Bug Bounty", subtitle: "취약점 분석과 방법론", icon: "BB", color: "blue" },
  { id: "docs", number: "04", title: "블로그 / 기술문서", subtitle: "기술 메모와 문서 작성", icon: "DOC", color: "blue" },
  { id: "research", number: "05", title: "논문 / 컨퍼런스", subtitle: "읽고 들은 내용 정리", icon: "RES", color: "blue" },
  { id: "certification", number: "06", title: "공모전 / 자격증", subtitle: "준비 과정과 회고", icon: "CERT", color: "blue" },
];

// 실제 글을 작성하면 url을 해당 문서 경로로 바꾸고 draft를 false로 설정하세요.
const posts = [
  {
    category: "development",
    date: "2026.10.29",
    title: "GitHub Pages로 개인 기술 블로그 시작하기",
    summary: "저장소 생성부터 정적 사이트 배포까지, 첫 블로그를 만든 과정을 정리합니다.",
    tags: ["GitHub Pages", "HTML", "CSS"],
    url: "posts/github-pages-start.html",
    draft: false,
  },
  {
    category: "development",
    date: "준비 중",
    title: "차량 통신과 CAN 기초 정리",
    summary: "차량 네트워크를 공부하며 CAN 통신의 구조와 기본 개념을 정리할 예정입니다.",
    tags: ["차량 보안", "CAN"],
    url: "#archive",
    draft: true,
  },
  {
    category: "ctf",
    date: "준비 중",
    title: "첫 Wargame 풀이 정리",
    summary: "풀이 과정과 실패한 접근, 핵심 개념을 함께 기록할 예정입니다.",
    tags: ["Wargame", "Write-up"],
    url: "#archive",
    draft: true,
  },
  {
    category: "bug-bounty",
    date: "준비 중",
    title: "웹 취약점 점검 흐름 정리",
    summary: "정찰부터 보고서 작성까지 반복 가능한 흐름으로 정리할 예정입니다.",
    tags: ["Bug Bounty", "Methodology"],
    url: "#archive",
    draft: true,
  },
  {
    category: "docs",
    date: "준비 중",
    title: "기술 블로그 글 작성 방식 정리",
    summary: "다시 읽었을 때 재현할 수 있는 기술 기록의 조건을 정리할 예정입니다.",
    tags: ["Documentation", "Blog"],
    url: "#archive",
    draft: true,
  },
  {
    category: "research",
    date: "준비 중",
    title: "보안 논문 읽기 메모",
    summary: "문제 정의, 핵심 기여, 한계를 중심으로 읽는 템플릿을 만들 예정입니다.",
    tags: ["Paper", "Research"],
    url: "#archive",
    draft: true,
  },
  {
    category: "certification",
    date: "준비 중",
    title: "자격증 준비 기록",
    summary: "공모전과 자격증 준비 과정을 회고하고 다음 도전을 설계할 예정입니다.",
    tags: ["Challenge", "Certificate"],
    url: "#archive",
    draft: true,
  },
];

const categoryGrid = document.querySelector("#categoryGrid");
const postList = document.querySelector("#postList");
const filterReset = document.querySelector("#filterReset");
const emptyState = document.querySelector("#emptyState");
const searchDialog = document.querySelector("#searchDialog");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");
let activeCategory = null;

function categoryById(id) {
  return categories.find((category) => category.id === id);
}

function renderCategories() {
  categoryGrid.innerHTML = categories
    .map(
      (category) => `
        <button class="category-card" type="button" data-category="${category.id}" data-color="${category.color}" aria-pressed="false">
          <span class="category-top">
            <span>/ ${category.number}</span>
            <span class="category-icon" aria-hidden="true">${category.icon}</span>
          </span>
          <h3>${category.title}</h3>
          <p>${category.subtitle}</p>
        </button>
      `,
    )
    .join("");

  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => setCategory(card.dataset.category));
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
      <a class="post-content" href="${post.url}" ${post.draft ? 'aria-label="준비 중인 글"' : ""}>
        <h4>${post.title}</h4>
        <p>${post.summary}</p>
        <div class="post-tags" aria-label="태그">
          ${post.tags.map((tag) => `<span class="post-tag"># ${tag}</span>`).join("")}
        </div>
      </a>
      <a class="post-arrow" href="${post.url}" aria-label="${post.title} 보기">↗</a>
    </article>
  `;
}

function renderPosts(items = posts) {
  postList.innerHTML = items.map(postTemplate).join("");
  emptyState.hidden = items.length !== 0;
}

function setCategory(categoryId) {
  activeCategory = categoryId;
  const filtered = posts.filter((post) => post.category === categoryId);
  renderPosts(filtered);
  filterReset.hidden = false;

  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    const isActive = card.dataset.category === categoryId;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });

  document.querySelector(".posts-toolbar").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetCategory() {
  activeCategory = null;
  renderPosts();
  filterReset.hidden = true;
  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    card.classList.remove("active");
    card.setAttribute("aria-pressed", "false");
  });
}

function openSearch() {
  if (!searchDialog.open) searchDialog.showModal();
  window.setTimeout(() => searchInput.focus(), 50);
}

function renderSearchResults(query) {
  const term = query.trim().toLocaleLowerCase("ko");
  if (!term) {
    searchResults.innerHTML = "<p>검색어를 입력하면 관련 기록을 찾아드립니다.</p>";
    return;
  }

  const matches = posts.filter((post) => {
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
    : "<p>일치하는 기록이 없습니다. 다른 검색어를 시도해 보세요.</p>";

  searchResults.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => searchDialog.close());
  });
}

function setupTheme() {
  const storedTheme = localStorage.getItem("frontier-theme");
  const theme = storedTheme || "light";
  document.documentElement.dataset.theme = theme;

  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("frontier-theme", nextTheme);
    document.querySelector(".theme-toggle").setAttribute(
      "aria-label",
      nextTheme === "dark" ? "밝은 테마로 전환" : "어두운 테마로 전환",
    );
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
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "모바일 메뉴 닫기");
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
    }
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

function setupReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

renderCategories();
renderPosts();
setupTheme();
setupMobileMenu();
setupReveal();

const githubLink = document.querySelector("#githubLink");
if (githubLink) githubLink.href = PROFILE.githubUrl;
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector(".search-trigger").addEventListener("click", openSearch);
filterReset.addEventListener("click", resetCategory);
searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
window.addEventListener("scroll", () => document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 12));
window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
});
