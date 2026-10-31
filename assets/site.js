// Jakarta local time in the sidebar.
const clock = document.querySelector("[data-clock]");
if (clock) {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour: "numeric", minute: "2-digit" });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 15000);
}

// Works tabs (Case Study / Website / Template).
const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  });
});

// Lightbox for case study images: click to enlarge, arrows to step, Esc or backdrop to close.
const shots = [...document.querySelectorAll(".figure img")];
if (shots.length) {
  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Image viewer");
  box.innerHTML = `
    <img alt="">
    <button class="lb-close" type="button" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <button class="lb-prev" type="button" aria-label="Previous image"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
    <button class="lb-next" type="button" aria-label="Next image"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
    <span class="lb-count" aria-live="polite"></span>`;
  document.body.append(box);
  const view = box.querySelector("img");
  const count = box.querySelector(".lb-count");
  let at = 0;
  const show = (i) => {
    at = (i + shots.length) % shots.length;
    view.src = shots[at].currentSrc || shots[at].src;
    view.alt = shots[at].alt;
    count.textContent = `${at + 1} / ${shots.length}`;
  };
  shots.forEach((img, i) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Enlarge image${img.alt ? `: ${img.alt}` : ""}`);
    const open = () => { show(i); box.showModal(); };
    img.addEventListener("click", open);
    img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  box.querySelector(".lb-close").addEventListener("click", () => box.close());
  box.querySelector(".lb-prev").addEventListener("click", () => show(at - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(at + 1));
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(at - 1);
    if (e.key === "ArrowRight") show(at + 1);
  });
}

// Case study table of contents follows the section in view.
const tocLinks = [...document.querySelectorAll(".toc a")];
if (tocLinks.length) {
  const byId = new Map(tocLinks.map((a) => [a.hash.slice(1), a]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      tocLinks.forEach((a) => a.removeAttribute("aria-current"));
      byId.get(e.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
}
