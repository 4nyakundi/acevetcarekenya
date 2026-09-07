/**
 * ===================================================================
 * ACE VET CARE KENYA - LIGHT, EFFORTLESS & SMOOTH GSAP / LENIS ENGINE
 * Lightweight 60fps momentum, zero lag, instant responsiveness
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Lightweight, Feather-Smooth Lenis Engine
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 0.85, // Lightweight, snappy and natural
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential curve
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false, // 100% native 120Hz/60Hz touch response on mobile
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
      });

      // Seamless sync with GSAP & AOS
      lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        if (typeof AOS !== 'undefined') AOS.refresh();
      });

      if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }

      // Effortless anchor jump with smooth glide
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#' && document.querySelector(targetId)) {
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            lenis.scrollTo(targetEl, { offset: -70, duration: 0.85 });
          }
        });
      });
    } catch (e) {
      console.warn('Lenis smooth scroll ready:', e);
    }
  }

  // Check for GSAP availability
  if (typeof gsap === 'undefined') {
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (prefersReducedMotion) {
    return;
  }

  // =================================================================
  // 2. HERO ENTRANCE - CRISP & LIGHT
  // =================================================================
  const heroSection = document.querySelector('#hero, .hero');
  if (heroSection) {
    const heroTl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.7 }
    });

    const heroElements = heroSection.querySelectorAll('h1, p.hero-subtext, p.hero-lead, .btn-premium-primary, .btn-whatsapp, .hero-badges-container, .floating-badge');
    
    if (heroElements.length > 0) {
      heroTl
        .fromTo('#hero .badge', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, clearProps: 'all' }, 0.05)
        .fromTo('#hero h1', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, clearProps: 'all' }, 0.15)
        .fromTo('#hero p.hero-subtext, #hero p.hero-lead', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, clearProps: 'all' }, 0.3)
        .fromTo('#hero .btn-premium-primary, #hero .btn-whatsapp', { y: 15, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'all' }, 0.45)
        .fromTo('#hero .floating-badge', { scale: 0.85, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }, 0.55);
    }

    // Light ambient floating physics
    const badge1 = document.querySelector('.badge-emergency, .badge-1');
    const badge2 = document.querySelector('.badge-doctors, .badge-2');
    const badge3 = document.querySelector('.floating-badge:not(.badge-emergency):not(.badge-doctors)');

    if (badge1) {
      gsap.to(badge1, { y: '+=8', rotation: 0.6, duration: 3.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (badge2) {
      gsap.to(badge2, { y: '-=8', rotation: -0.6, duration: 2.7, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.2 });
    }
    if (badge3) {
      gsap.to(badge3, { y: '+=9', rotation: 0.8, duration: 3.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
    }
  }

  // =================================================================
  // 3. STATS SECTION - LIGHT STAGGER REVEAL
  // =================================================================
  const statsSection = document.querySelector('#stats, .stats');
  if (statsSection) {
    const statItems = statsSection.querySelectorAll('.stat-item');
    if (statItems.length > 0) {
      gsap.fromTo(statItems, 
        { y: 25, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: statsSection,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // =================================================================
  // 4. CAPABILITIES (ZUBOX) CARDS
  // =================================================================
  const zuboxGrid = document.querySelector('.zubox-card-grid');
  if (zuboxGrid) {
    const cards = zuboxGrid.querySelectorAll('.zubox-card, .col-lg-4');
    gsap.fromTo(cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: zuboxGrid,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // =================================================================
  // 5. TESTIMONIAL CARDS
  // =================================================================
  const testimonialSection = document.querySelector('#testimonials');
  if (testimonialSection) {
    const testimonialCards = testimonialSection.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 0) {
      gsap.fromTo(testimonialCards,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: testimonialSection,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // =================================================================
  // 6. 3D INTERACTIVE TILT (LIGHTWEIGHT ON DESKTOP)
  // =================================================================
  if (window.matchMedia('(hover: hover) and (min-width: 992px)').matches) {
    const tiltCards = document.querySelectorAll('.stat-item, .zubox-card, .doctor-card, .contact-card-item, .testimonial-card');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        gsap.to(card, {
          transformPerspective: 1000,
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.2,
          ease: 'power1.out',
          transformOrigin: 'center center'
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  }

  // Final refresh on load
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    if (typeof AOS !== 'undefined') AOS.refresh();
  });

});
