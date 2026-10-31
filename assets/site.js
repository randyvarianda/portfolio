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
