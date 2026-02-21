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
    initHeroRotate();
    initScreenTime();
    initQuiz();
    initStatCounters();
    initParallax();
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

  // ---------- Hero: Rotating Text ----------
  function initHeroRotate() {
    var words = document.querySelectorAll('.hero__rotate-word');
    if (words.length < 2) return;

    var currentIndex = 0;

    setInterval(function () {
      words[currentIndex].classList.remove('hero__rotate-word--active');
      currentIndex = (currentIndex + 1) % words.length;
      words[currentIndex].classList.add('hero__rotate-word--active');
    }, 3000);
  }

  // ---------- Screen Time Counter ----------
  function initScreenTime() {
    var numberEl = document.getElementById('screenTimeHours');
    var fillEl = document.getElementById('screenTimeFill');
    var markerEl = document.getElementById('screenTimeMarker');
    if (!numberEl) return;

    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();

    // Assume wake time ~7 AM, average screen ratio ~44% of waking hours
    var wakeHour = 7;
    var awakeHours = Math.max(0, hour + minute / 60 - wakeHour);
    var screenHours = Math.round(awakeHours * 0.44 * 10) / 10;
    if (screenHours < 0.5) screenHours = 0.5;

    // Day progress (6am to midnight = 18 hours)
    var dayProgress = Math.min(100, Math.max(0, ((hour + minute / 60 - 6) / 18) * 100));

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(numberEl, screenHours, 2000);
            if (fillEl) {
              fillEl.style.width = dayProgress + '%';
            }
            if (markerEl) {
              markerEl.style.left = dayProgress + '%';
              setTimeout(function () {
                markerEl.style.opacity = '1';
              }, 2000);
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(numberEl);
    }
  }

  function animateCounter(el, target, duration) {
    var startTime = null;
    var isFloat = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;

      el.textContent = isFloat ? current.toFixed(1) : Math.round(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ---------- Island Finder Quiz ----------
  function initQuiz() {
    var card = document.getElementById('quizCard');
    if (!card) return;

    var steps = card.querySelectorAll('.quiz__step');
    var progressFill = document.getElementById('quizProgress');
    var resultEl = document.getElementById('quizResult');
    var restartBtn = document.getElementById('quizRestart');
    var answers = [];
    var totalSteps = steps.length;

    steps.forEach(function (step, stepIndex) {
      var options = step.querySelectorAll('.quiz__option');
      options.forEach(function (option) {
        option.addEventListener('click', function () {
          answers[stepIndex] = option.getAttribute('data-value');

          // Highlight selected
          options.forEach(function (o) {
            o.style.borderColor = '';
            o.style.background = '';
          });
          option.style.borderColor = 'var(--coral)';
          option.style.background = 'var(--sand)';

          // Move to next step after short delay
          setTimeout(function () {
            if (stepIndex < totalSteps - 1) {
              steps[stepIndex].classList.remove('quiz__step--active');
              steps[stepIndex + 1].classList.add('quiz__step--active');
              progressFill.style.width = ((stepIndex + 2) / totalSteps * 100) + '%';
            } else {
              showQuizResult();
            }
          }, 300);
        });
      });
    });

    function showQuizResult() {
      steps.forEach(function (s) { s.classList.remove('quiz__step--active'); });
      progressFill.style.width = '100%';

      var type = answers[0] || 'gentle';
      var results = {
        gentle: {
          type: 'Gentle Islands',
          level: 'Detox Level 2 \u2014 Phone-Free Days',
          desc: 'You need calm, ease, and softness. Think walkable paths, warm light, and gentle waves. Start slow\u2014your nervous system will thank you.'
        },
        healing: {
          type: 'Healing Islands',
          level: 'Detox Level 3 \u2014 Total Offline',
          desc: 'You\'re carrying too much. You need hot springs, warm food, and quiet culture. Islands that let you put everything down without judgment.'
        },
        wild: {
          type: 'Wild Islands',
          level: 'Detox Level 4 \u2014 Silent Island',
          desc: 'You need to feel something real. Storms, cliffs, raw coast. Your frustration needs an outlet bigger than a screen. Let nature match your energy.'
        },
        lonely: {
          type: 'Lonely Islands',
          level: 'Detox Level 4 \u2014 Silent Island',
          desc: 'You need space from people, not just screens. Empty paths, expansive silence, and the rare luxury of being truly alone. No small talk required.'
        },
        social: {
          type: 'Social Islands',
          level: 'Detox Level 1 \u2014 Soft Detox',
          desc: 'You don\'t need isolation\u2014you need better connection. Community, good food, low-key fun. Detox without the loneliness.'
        }
      };

      var result = results[type] || results.gentle;
      document.getElementById('quizResultType').textContent = result.type;
      document.getElementById('quizResultLevel').textContent = result.level;
      document.getElementById('quizResultDesc').textContent = result.desc;
      resultEl.classList.add('quiz__result--visible');
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        answers = [];
        resultEl.classList.remove('quiz__result--visible');
        steps.forEach(function (s) { s.classList.remove('quiz__step--active'); });
        steps[0].classList.add('quiz__step--active');
        progressFill.style.width = '0%';
        card.querySelectorAll('.quiz__option').forEach(function (o) {
          o.style.borderColor = '';
          o.style.background = '';
        });
      });
    }
  }

  // ---------- Impact Stats Counter ----------
  function initStatCounters() {
    var counters = document.querySelectorAll('.stat__number');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (counter) {
        counter.textContent = counter.getAttribute('data-target') + (counter.getAttribute('data-suffix') || '');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var counter = entry.target;
          var target = parseInt(counter.getAttribute('data-target'), 10);
          var suffix = counter.getAttribute('data-suffix') || '';
          animateStatCounter(counter, target, suffix, 2000);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateStatCounter(el, target, suffix, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);

      if (target >= 10000) {
        el.textContent = current.toLocaleString() + suffix;
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ---------- Hero Parallax ----------
  function initParallax() {
    var heroBg = document.querySelector('.hero__bg img');
    if (!heroBg) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'scale(1.1) translateY(' + (scrollY * 0.3) + 'px)';
      }
    }, { passive: true });
  }
})();
