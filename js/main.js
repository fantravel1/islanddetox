/* ==========================================================================
   IslandDetox.com — Main JavaScript
   Scroll reveals, mobile nav, FAQ accordion, compass, interactive map
   ========================================================================== */

(function () {
  'use strict';

  // ---------- DOM Ready ----------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initMobileMenu();
    initScrollReveal();
    initFAQ();
    initCompass();
    initLevelBars();
    initIndexBars();
    initSmoothScrollLinks();
  }

  // ---------- Navigation: scroll-aware ----------
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrollThreshold = 60;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check initial state
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var mobileMenu = document.querySelector('.nav__mobile');
    var mobileLinks = document.querySelectorAll('.nav__mobile-link');

    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('nav__toggle--active');
      mobileMenu.classList.toggle('nav__mobile--open');
      document.body.style.overflow = mobileMenu.classList.contains('nav__mobile--open') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('nav__toggle--active');
        mobileMenu.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('nav__mobile--open')) {
        toggle.classList.remove('nav__toggle--active');
        mobileMenu.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Scroll Reveal (Intersection Observer) ----------
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Fallback if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('reveal--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---------- FAQ Accordion ----------
  function initFAQ() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq__item--open');

        // Close all first
        items.forEach(function (other) {
          other.classList.remove('faq__item--open');
          var otherAnswer = other.querySelector('.faq__answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('faq__item--open');
          answer.style.maxHeight = answer.scrollHeight + 'px';

          // Update ARIA
          question.setAttribute('aria-expanded', 'true');
        } else {
          question.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---------- Compass (Back-to-top + progress) ----------
  function initCompass() {
    var compass = document.querySelector('.compass');
    if (!compass) return;

    var ring = compass.querySelector('.compass__ring');

    function onScroll() {
      var scrollY = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollY / docHeight : 0;

      // Show/hide compass
      if (scrollY > 400) {
        compass.classList.add('compass--visible');
      } else {
        compass.classList.remove('compass--visible');
      }

      // Rotate ring based on scroll progress
      if (ring) {
        ring.style.transform = 'rotate(' + (progress * 360) + 'deg)';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    compass.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    onScroll();
  }

  // ---------- Level Bars Animation ----------
  function initLevelBars() {
    var cards = document.querySelectorAll('.level-card');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) {
        card.classList.add('is-visible');
        var fill = card.querySelector('.level-card__bar-fill');
        if (fill && fill.dataset.width) {
          fill.style.width = fill.dataset.width;
        }
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            var fill = entry.target.querySelector('.level-card__bar-fill');
            if (fill && fill.dataset.width) {
              fill.style.width = fill.dataset.width;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  // ---------- Index Score Bars Animation ----------
  function initIndexBars() {
    var bars = document.querySelectorAll('.index__score-fill');
    if (!bars.length) return;

    if (!('IntersectionObserver' in window)) {
      bars.forEach(function (bar) {
        if (bar.dataset.width) bar.style.width = bar.dataset.width;
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            if (bar.dataset.width) bar.style.width = bar.dataset.width;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
})();
