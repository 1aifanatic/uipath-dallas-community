const slides = Array.from(document.querySelectorAll(".slide"));
const previousButton = document.querySelector("#prevSlide");
const nextButton = document.querySelector("#nextSlide");
const slideNumber = document.querySelector("#slideNumber");
const slideTotal = document.querySelector("#slideTotal");
const progressBar = document.querySelector("#progressBar");
const dots = document.querySelector("#slideDots");

let activeIndex = 0;

function clampSlide(index) {
  return Math.max(0, Math.min(slides.length - 1, index));
}

function showSlide(index) {
  activeIndex = clampSlide(index);

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  document.querySelectorAll(".slide-dots button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeIndex);
    dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
  });

  slideNumber.textContent = String(activeIndex + 1);
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  previousButton.disabled = activeIndex === 0;
  nextButton.disabled = activeIndex === slides.length - 1;
  window.location.hash = `slide-${activeIndex + 1}`;
}

function nextSlide() {
  showSlide(activeIndex + 1);
}

function previousSlide() {
  showSlide(activeIndex - 1);
}

slides.forEach((slide, index) => {
  slide.dataset.slide = String(index + 1);
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to slide ${index + 1}: ${slide.dataset.title || "Untitled"}`);
  dot.addEventListener("click", () => showSlide(index));
  dots.appendChild(dot);
});

slideTotal.textContent = String(slides.length);

previousButton.addEventListener("click", previousSlide);
nextButton.addEventListener("click", nextSlide);

document.querySelector(".deck").addEventListener("click", (event) => {
  const interactive = event.target.closest("button, a, input, textarea, select");
  if (!interactive) {
    nextSlide();
  }
});

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

const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
const initialSlide = hashMatch ? Number(hashMatch[1]) - 1 : 0;
showSlide(initialSlide);
