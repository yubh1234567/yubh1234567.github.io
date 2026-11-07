const progress = document.querySelector("#readingProgress");
const savedTheme = localStorage.getItem("bpr0-theme") || "light";
document.documentElement.dataset.theme = savedTheme;
document.querySelector('meta[name="theme-color"]').content = savedTheme === "dark" ? "#01040a" : "#050a12";

function updateReadingProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();
