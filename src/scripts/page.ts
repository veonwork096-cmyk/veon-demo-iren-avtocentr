// Page behaviour. Everything works without it: menu is <details>, all price groups and brands are shown,
// the call bar is visible. Scripts only add tabs/accordion, the brands toggle and the call bar timing.
const desktop = window.matchMedia("(min-width: 1024px)");

/* ---------- menu: close on link click and Escape ---------- */
const menu = document.querySelector<HTMLDetailsElement>("[data-menu]");
if (menu) {
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary")?.focus(); }
  });
  desktop.addEventListener("change", () => { menu.open = false; });
}

/* ---------- price switcher: tabs ≥ 1024, accordion below ---------- */
document.querySelectorAll<HTMLElement>("[data-switcher]").forEach((sw) => {
  const tabs = [...sw.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...sw.querySelectorAll<HTMLElement>("[data-panel]")];
  const accs = [...sw.querySelectorAll<HTMLButtonElement>("[data-acc]")];
  const tabList = sw.querySelector<HTMLElement>("[data-tabs]");
  let active = tabs[0]?.dataset.tab ?? "";

  const box = sw.querySelector<HTMLElement>(".switcher__panels");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fade = () => (reduce.matches ? 0 : 240); // --dur-tab
  const timers = new Map<HTMLElement, number>();

  // Inactive panels end up `hidden` (out of the accessibility tree and of full-page captures);
  // the box keeps the tallest panel's height, so switching never jumps.
  const fitHeight = () => {
    if (!box) return;
    box.style.minHeight = "";
    const was = panels.map((p) => p.hidden);
    panels.forEach((p) => { p.hidden = false; });
    box.style.minHeight = `${box.offsetHeight}px`;
    panels.forEach((p, i) => { p.hidden = was[i]; });
  };

  const select = (id: string, focus = false) => {
    active = id;
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => {
      const on = p.dataset.panel === id;
      window.clearTimeout(timers.get(p));
      if (!desktop.matches) { p.classList.toggle("is-active", on); return; }
      p.toggleAttribute("inert", !on);
      if (on) {
        p.removeAttribute("aria-hidden");
        p.hidden = false;
        void p.offsetWidth; // start the fade from opacity 0
        p.classList.add("is-active");
      } else {
        p.setAttribute("aria-hidden", "true");
        const wasActive = p.classList.contains("is-active");
        p.classList.remove("is-active");
        if (!wasActive || !fade()) p.hidden = true;
        else timers.set(p, window.setTimeout(() => { if (!p.classList.contains("is-active")) p.hidden = true; }, fade()));
      }
    });
  };

  const setMode = () => {
    if (desktop.matches) {
      tabList?.setAttribute("role", "tablist");
      tabList?.setAttribute("aria-orientation", "vertical");
      tabs.forEach((t) => { t.setAttribute("role", "tab"); t.setAttribute("aria-controls", `panel-${t.dataset.tab}`); });
      panels.forEach((p) => { p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", `tab-${p.dataset.panel}`); p.tabIndex = 0; });
      sw.querySelectorAll<HTMLElement>(".switcher__body").forEach((b) => { b.hidden = false; });
      panels.forEach((p) => { p.hidden = false; p.classList.toggle("is-active", p.dataset.panel === active); });
      fitHeight();
      select(active);
    } else {
      tabList?.removeAttribute("role");
      tabs.forEach((t) => { t.removeAttribute("role"); t.removeAttribute("aria-controls"); });
      panels.forEach((p) => { p.removeAttribute("role"); p.removeAttribute("aria-labelledby"); p.removeAttribute("tabindex"); p.removeAttribute("inert"); p.removeAttribute("aria-hidden"); p.hidden = false; });
      if (box) box.style.minHeight = "";
      accs.forEach((a, i) => {
        const open = i === 0;
        a.setAttribute("aria-expanded", String(open));
        const body = document.getElementById(a.getAttribute("aria-controls") ?? "");
        if (body) body.hidden = !open;
      });
    }
  };

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.tab ?? ""));
    t.addEventListener("keydown", (e) => {
      const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (next !== undefined) { e.preventDefault(); select(tabs[(i + next + tabs.length) % tabs.length].dataset.tab ?? "", true); }
      if (e.key === "Home") { e.preventDefault(); select(tabs[0].dataset.tab ?? "", true); }
      if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1].dataset.tab ?? "", true); }
    });
  });
  accs.forEach((a) => a.addEventListener("click", () => {
    const open = a.getAttribute("aria-expanded") !== "true";
    a.setAttribute("aria-expanded", String(open));
    const body = document.getElementById(a.getAttribute("aria-controls") ?? "");
    if (body) body.hidden = !open;
  }));

  sw.classList.add("is-enhanced");
  setMode();
  requestAnimationFrame(() => requestAnimationFrame(() => sw.classList.add("is-ready")));
  desktop.addEventListener("change", setMode);
  let rz = 0;
  window.addEventListener("resize", () => { window.clearTimeout(rz); rz = window.setTimeout(() => { if (desktop.matches) fitHeight(); }, 150); });
  document.fonts?.ready.then(() => { if (desktop.matches) fitHeight(); });
});

/* ---------- brands: first 12 on phones, «Показати всі 28» ---------- */
const brandList = document.querySelector<HTMLElement>("[data-brands]");
const brandMore = document.querySelector<HTMLButtonElement>("[data-brands-more]");
if (brandList && brandMore) {
  brandList.classList.add("is-collapsed");
  brandMore.hidden = false;
  brandMore.addEventListener("click", () => {
    const open = brandList.classList.toggle("is-collapsed") === false;
    brandMore.setAttribute("aria-expanded", String(open));
    brandMore.textContent = open ? "Згорнути список" : "Показати всі 28";
  });
}

/* ---------- call bar: appears once the first screen is gone ---------- */
const bar = document.querySelector<HTMLElement>("[data-callbar]");
const hero = document.getElementById("hero");
if (bar && hero && "IntersectionObserver" in window) {
  bar.classList.add("is-armed");
  new IntersectionObserver(([e]) => {
    bar.classList.toggle("is-shown", !e.isIntersecting);
  }, { rootMargin: "0px 0px -40% 0px" }).observe(hero);
}
