(function () {
  "use strict";

  function getReduceMotionPreference() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initNavbarScrollState() {
    var setState = function () {
      if (window.scrollY > 14) {
        document.body.classList.add("nav-scrolled");
      } else {
        document.body.classList.remove("nav-scrolled");
      }
    };

    setState();
    window.addEventListener("scroll", setState, { passive: true });
  }

  function initRevealAnimations(reduceMotion) {
    var revealTargets = document.querySelectorAll(
      ".home-header, .myAvtar, .home-about-description, .home-about-social, .quote-card-view, .about-img, .tech-icons, .project-heading, .user-projects, .resume .resume-item"
    );

    if (!revealTargets.length) {
      return;
    }

    revealTargets.forEach(function (el, index) {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", Math.min(index * 65, 680) + "ms");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initInteractiveGlow(reduceMotion) {
    if (reduceMotion) {
      return;
    }

    var glowTargets = document.querySelectorAll(".user-projects, .resume .resume-item, .quote-card-view, .tech-icons");

    glowTargets.forEach(function (target) {
      target.addEventListener("pointermove", function (event) {
        var rect = target.getBoundingClientRect();
        target.style.setProperty("--mx", event.clientX - rect.left + "px");
        target.style.setProperty("--my", event.clientY - rect.top + "px");
      });

      target.addEventListener("pointerleave", function () {
        target.style.removeProperty("--mx");
        target.style.removeProperty("--my");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var reduceMotion = getReduceMotionPreference();

    if (window.SweetScroll) {
      new SweetScroll({
        easing: "easeOutQuint",
        speed: 680,
        updateURL: false,
      });
    }

    initNavbarScrollState();
    initRevealAnimations(reduceMotion);
    initInteractiveGlow(reduceMotion);
  });
})();