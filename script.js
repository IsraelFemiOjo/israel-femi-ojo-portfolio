(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  const showEverything = () => {
    revealItems.forEach((item) => {
      item.style.opacity = '1';
      item.style.transform = 'none';
      item.classList.add('is-visible');
    });
  };

  const startFallbackReveals = () => {
    if (!('IntersectionObserver' in window)) {
      showEverything();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealItems.forEach((item) => observer.observe(item));
  };

  const setProgress = () => {
    const progressBar = document.querySelector('.scroll-progress span');
    if (!progressBar) return;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const progress = available > 0 ? window.scrollY / available : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };

  if (reducedMotion) {
    showEverything();
    window.addEventListener('scroll', setProgress, { passive: true });
    setProgress();
    return;
  }

  if (!window.gsap || !window.ScrollTrigger) {
    startFallbackReveals();
    window.addEventListener('scroll', setProgress, { passive: true });
    setProgress();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const motion = gsap.matchMedia();

  if (document.querySelector('.hero-scene')) {
    const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
    hero
      .from('.hero-overline', { opacity: 0, y: 18, duration: 0.55 })
      .from('.hero-title', { opacity: 0, y: 46, duration: 0.9 }, '-=0.2')
      .from('.hero-intro', { opacity: 0, y: 26, duration: 0.7 }, '-=0.48')
      .from('.hero-actions > *', { opacity: 0, y: 20, duration: 0.55, stagger: 0.1 }, '-=0.38')
      .from('.hero-note span', { opacity: 0, y: 12, duration: 0.45, stagger: 0.08 }, '-=0.25');

    motion.add('(min-width: 761px)', () => {
      hero
        .from('.portrait-stage', { clipPath: 'inset(0 0 0 100%)', duration: 1.05 }, 0.1)
        .from('.portrait-lines', { opacity: 0, duration: 0.7 }, 0.82)
        .from('.portrait', { opacity: 0, y: 65, scale: 0.96, duration: 0.95 }, 0.52)
        .from('.portrait-label', { opacity: 0, x: 30, duration: 0.55 }, 1.05)
        .from('.scroll-cue', { opacity: 0, duration: 0.5 }, 1.2);
    });

    motion.add('(max-width: 760px)', () => {
      hero
        .from('.portrait-stage', { opacity: 0, y: 36, duration: 0.75 }, '-=0.2')
        .from('.portrait', { opacity: 0, y: 42, duration: 0.72 }, '-=0.48');
    });
  }

  revealItems.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.78,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 84%',
        once: true
      }
    });
  });

  motion.add('(min-width: 761px)', () => {
    gsap.utils.toArray('.project-visual, .featured-sample, .recognition-shot, .analytics-band').forEach((item) => {
      gsap.from(item, {
        opacity: 0.72,
        y: 58,
        scale: 0.965,
        clipPath: 'inset(7% 0 7% 0)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 82%', once: true }
      });
    });

    gsap.utils.toArray('.case-image img, .recognition-shot img, .analytics-frame img').forEach((image) => {
      gsap.fromTo(image,
        { yPercent: -2 },
        {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: image.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    });

    const videoImage = document.querySelector('.video-card img, .featured-media img');
    if (videoImage) {
      gsap.fromTo(videoImage,
        { scale: 1.06, yPercent: -2 },
        {
          scale: 1.015,
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: videoImage.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65
          }
        }
      );
    }
  });

  const movingRule = document.querySelector('.moving-rule');
  if (movingRule) {
    gsap.fromTo(movingRule,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.work-intro',
          start: 'top 78%',
          end: 'bottom 35%',
          scrub: 0.55
        }
      }
    );
  }

  const scoreBars = document.querySelectorAll('.score-bars i');
  if (scoreBars.length) {
    gsap.fromTo(scoreBars,
      { '--bar-scale': 0 },
      {
        '--bar-scale': 1,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.score-bars', start: 'top 86%', once: true }
      }
    );
  }

  const progressBar = document.querySelector('.scroll-progress span');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.2 }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
