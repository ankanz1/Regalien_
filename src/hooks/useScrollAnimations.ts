import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Refresh ScrollTrigger after DOM settle
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    const ctx = gsap.context(() => {
      // 1. Reveal animations for headings and titles
      gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((elem) => {
        gsap.fromTo(
          elem,
          {
            opacity: 0,
            y: 50,
            clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 2. Parallax zoom & shift for imagery
      gsap.utils.toArray<HTMLElement>('.parallax-image').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.18, yPercent: -8 },
          {
            scale: 1,
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement || img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      });

      // 3. Staggered card cascades
      gsap.utils.toArray<HTMLElement>('.stagger-cards-container').forEach((container) => {
        const cards = container.querySelectorAll('.stagger-card');
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 60,
              scale: 0.94,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // 4. Kinetic floating decorative elements
      gsap.utils.toArray<HTMLElement>('.floating-deco').forEach((deco, i) => {
        const speed = (i + 1) * 25;
        gsap.to(deco, {
          yPercent: -speed,
          rotation: (i % 2 === 0 ? 1 : -1) * 15,
          ease: 'none',
          scrollTrigger: {
            trigger: deco.parentElement || deco,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      // 5. Number counter animations
      gsap.utils.toArray<HTMLElement>('.stat-counter').forEach((stat) => {
        const targetValue = parseInt(stat.getAttribute('data-target') || '0', 10);
        if (targetValue > 0) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetValue,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              stat.textContent = Math.floor(obj.val).toString();
            },
          });
        }
      });
    });

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);
}
