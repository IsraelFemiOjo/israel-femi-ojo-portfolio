(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  const motionItems = [...document.querySelectorAll(
    '.project-visual, .video-card, .featured-sample, .recognition-shot, .reply-card, .analytics-band, .case-image, .error-record'
  )];
  const scenes = [...document.querySelectorAll('.scene, .sample-section, .case-content section')];
  const scoreBars = document.querySelector('.score-bars');
  const progressBar = document.querySelector('.scroll-progress span');
  const movingRule = document.querySelector('.moving-rule');
  const parallaxImages = [...document.querySelectorAll('.case-image img, .recognition-shot img, .analytics-frame img')];

  const clamp = (minimum, value, maximum) => Math.min(maximum, Math.max(minimum, value));

  const showEverything = () => {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    motionItems.forEach((item) => item.classList.add('is-motion-visible'));
    scenes.forEach((scene) => scene.classList.add('scene-active'));
    if (scoreBars) scoreBars.classList.add('is-visible');
  };

  const observeOnce = (items, className, options = {}) => {
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add(className));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: options.rootMargin || '0px 0px -11% 0px',
      threshold: options.threshold || 0.08
    });

    items.forEach((item) => observer.observe(item));
  };

  const animateHero = () => {
    if (!document.querySelector('.hero-scene') || !Element.prototype.animate) return;

    const animate = (selector, keyframes, options) => {
      document.querySelectorAll(selector).forEach((item, index) => {
        item.animate(keyframes, {
          duration: options.duration,
          delay: (options.delay || 0) + index * (options.stagger || 0),
          easing: options.easing || 'cubic-bezier(.2,.72,.2,1)',
          fill: 'both'
        });
      });
    };

    animate('.hero-overline', [
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 520, delay: 80 });

    animate('.hero-title', [
      { opacity: 0, transform: 'translateY(46px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 880, delay: 180 });

    animate('.hero-intro', [
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 700, delay: 430 });

    animate('.hero-actions > *', [
      { opacity: 0, transform: 'translateY(18px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 560, delay: 560, stagger: 90 });

    animate('.hero-note span', [
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 480, delay: 710, stagger: 75 });

    const wideScreen = window.matchMedia('(min-width: 761px)').matches;
    animate('.portrait-stage', wideScreen ? [
      { clipPath: 'inset(0 0 0 100%)' },
      { clipPath: 'inset(0 0 0 0)' }
    ] : [
      { opacity: 0, transform: 'translateY(30px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 980, delay: 130 });

    animate('.portrait', [
      { opacity: 0, transform: 'translateY(34px) scale(.985)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], { duration: 850, delay: 520 });

    animate('.portrait-index, .portrait-label, .scroll-cue', [
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 480, delay: 840, stagger: 90 });
  };

  const observeScenes = () => {
    if (!('IntersectionObserver' in window)) {
      scenes.forEach((scene) => scene.classList.add('scene-active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('scene-active', entry.isIntersecting);
      });
    }, { rootMargin: '-34% 0px -34% 0px', threshold: 0 });

    scenes.forEach((scene) => observer.observe(scene));
  };

  let frameRequested = false;
  const updateScrollState = () => {
    frameRequested = false;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? window.scrollY / documentHeight : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${clamp(0, progress, 1)})`;

    if (movingRule) {
      const bounds = movingRule.parentElement.getBoundingClientRect();
      const sectionProgress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height * 0.55);
      movingRule.style.transform = `scaleX(${clamp(0, sectionProgress, 1)})`;
    }

    if (window.innerWidth > 760) {
      parallaxImages.forEach((image) => {
        const bounds = image.parentElement.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const offset = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / window.innerHeight;
        image.style.transform = `translate3d(0, ${clamp(-16, offset * -22, 16)}px, 0) scale(1.025)`;
      });
    }
  };

  const requestScrollUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollState);
  };

  if (reducedMotion) {
    showEverything();
    if (progressBar) {
      window.addEventListener('scroll', requestScrollUpdate, { passive: true });
      updateScrollState();
    }
    return;
  }

  motionItems.forEach((item) => item.classList.add('motion-target'));
  animateHero();
  observeOnce(revealItems, 'is-visible');
  observeOnce(motionItems, 'is-motion-visible', { rootMargin: '0px 0px -8% 0px' });
  if (scoreBars) observeOnce([scoreBars], 'is-visible', { rootMargin: '0px 0px -14% 0px' });
  observeScenes();

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  window.addEventListener('load', requestScrollUpdate, { once: true });
  updateScrollState();
})();
