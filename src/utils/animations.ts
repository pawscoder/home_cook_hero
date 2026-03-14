import confetti from "canvas-confetti"

function getRoot(): HTMLElement {
  return document.getElementById("anim-root") ?? document.body
}

function showOverlay(html: string, duration: number, flashClass?: string): void {
  const root = getRoot()

  if (flashClass) {
    const flash = document.createElement("div")
    flash.className = `anim-flash ${flashClass}`
    root.appendChild(flash)
    setTimeout(() => flash.remove(), 700)
  }

  const el = document.createElement("div")
  el.className = "anim-overlay"
  el.innerHTML = html
  root.appendChild(el)

  // Double rAF to ensure the element is painted before transitioning opacity
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add("anim-overlay--visible")
    })
  })

  setTimeout(() => {
    el.classList.remove("anim-overlay--visible")
    el.addEventListener("transitionend", () => el.remove(), { once: true })
  }, duration - 350)
}

export function triggerCelebration(): void {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { x: 0.5, y: 1 },
    colors: ["#e9c46a", "#2d6a4f", "#ffffff", "#f4a261"],
  })
}

export function triggerSkip(): void {
  showOverlay(`<div class="anim-overlay__emoji">👍</div>`, 1500, "anim-flash--green")
}

export function triggerRewardUnlock(rewardLabel: string): void {
  confetti({
    particleCount: 100,
    spread: 60,
    origin: { x: 0.5, y: 0.6 },
    colors: ["#e9c46a", "#f4a261", "#ffd700", "#fff"],
  })
  showOverlay(
    `<div class="anim-overlay__content">
      <div class="anim-overlay__heading">🏆 Reward Unlocked!</div>
      <div class="anim-overlay__label">${rewardLabel}</div>
    </div>`,
    2500
  )
}

export function triggerGuilt(): void {
  showOverlay(`<div class="anim-overlay__emoji">😬</div>`, 1500, "anim-flash--red")
}
