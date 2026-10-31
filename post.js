const progress = document.querySelector("#readingProgress");
const savedTheme = localStorage.getItem("frontier-theme") || "light";
document.documentElement.dataset.theme = savedTheme;

function updateReadingProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
}

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();
