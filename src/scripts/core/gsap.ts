import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip);

// One motion vocabulary for the whole site.
CustomEase.create('raha.out', '0.16, 1, 0.3, 1');
CustomEase.create('raha.inOut', '0.76, 0, 0.24, 1');
CustomEase.create('raha.soft', '0.45, 0, 0.1, 1');

gsap.defaults({ ease: 'raha.out', duration: 1.2 });
ScrollTrigger.config({ ignoreMobileResize: true });

export const root = document.documentElement;
export const reduced = root.classList.contains('is-reduced');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const mq = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1199px)',
  desktop: '(min-width: 768px)',
};

export { gsap, ScrollTrigger, SplitText, Flip };
