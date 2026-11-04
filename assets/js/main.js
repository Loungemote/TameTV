// TameTV site: progressive enhancement only. Every page works without this file.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header: solid background after scrolling.
  var header = document.querySelector("[data-header]");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile navigation.
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  if (toggle && nav && header) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
  }

  // Reveal on scroll. Siblings that enter together are staggered.
  var revealables = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  function show(el) {
    el.classList.add("is-visible");
    window.setTimeout(function () {
      el.classList.add("is-settled");
    }, 1200);
  }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible", "is-settled");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        var batch = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty("--reveal-delay", Math.min(batch * 70, 350) + "ms");
          batch += 1;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Pointer spotlight on cards.
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card, .case, .device").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", event.clientX - rect.left + "px");
        card.style.setProperty("--my", event.clientY - rect.top + "px");
      });
    });
  }

  // Text pages: mark the section in view in the table of contents.
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (link) {
      byId[decodeURIComponent(link.hash.slice(1))] = link;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (link) {
            link.classList.remove("is-active");
          });
          byId[entry.target.id].classList.add("is-active");
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var heading = document.getElementById(id);
      if (heading) spy.observe(heading);
    });
  }
})();
