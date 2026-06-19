const slides = Array.from(document.querySelectorAll(".slide"));
const deck = document.querySelector(".deck");

document.documentElement.classList.add("js-enabled");
document.body.classList.add("js-enabled");

let activeIndex = 0;

function updatePortraitScale() {
  if (!document.body.classList.contains("portrait")) return;

  const slideWidth = 720;
  const slideHeight = 1280;
  const horizontalMargin = 36;
  const verticalMargin = 104;
  const scale = Math.min(
    (window.innerWidth - horizontalMargin) / slideWidth,
    (window.innerHeight - verticalMargin) / slideHeight,
    1,
  );

  const boundedScale = Math.max(scale, 0.32);
  document.documentElement.style.setProperty("--deck-scale", String(boundedScale));
  document.documentElement.style.setProperty("--nav-scale", String(1 / boundedScale));
  document.documentElement.style.setProperty("--nav-bottom", `${18 / boundedScale}px`);
}

function clampSlide(index) {
  return Math.max(0, Math.min(slides.length - 1, index));
}

function slideIndexFromHash() {
  const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
  return hashMatch ? Number(hashMatch[1]) - 1 : 0;
}

function updateHash(index) {
  const nextHash = `#slide-${index + 1}`;
  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, "", nextHash);
  }
}

function showSlide(index, shouldUpdateHash = true) {
  activeIndex = clampSlide(index);

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.dataset.slide = String(slideIndex + 1);
  });

  if (shouldUpdateHash) {
    updateHash(activeIndex);
  }

  window.scrollTo(0, 0);
}

function nextSlide() {
  showSlide(activeIndex + 1);
}

function previousSlide() {
  showSlide(activeIndex - 1);
}

if (deck) {
  deck.addEventListener("click", (event) => {
    const interactive = event.target.closest("button, a, input, textarea, select");
    if (!interactive) {
      nextSlide();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;

  switch (event.key) {
    case "ArrowRight":
    case "PageDown":
    case " ":
      event.preventDefault();
      nextSlide();
      break;
    case "ArrowLeft":
    case "PageUp":
      event.preventDefault();
      previousSlide();
      break;
    case "Home":
      event.preventDefault();
      showSlide(0);
      break;
    case "End":
      event.preventDefault();
      showSlide(slides.length - 1);
      break;
    case "f":
    case "F":
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      break;
    default:
      break;
  }
});

window.addEventListener("hashchange", () => {
  showSlide(slideIndexFromHash(), false);
});

window.addEventListener("resize", updatePortraitScale);

updatePortraitScale();
showSlide(slideIndexFromHash(), false);
