import ResizeObserver from 'resize-observer-polyfill';
import { lerp, fixedDecimal } from './utils';

const PREFIX = 'custom-scroller';

const CSS_STYLE = `
  .${PREFIX}-wrapper { overflow: hidden; height: 100%; width: 100%; }
  .${PREFIX}-container { position: fixed; width: 100%; top: 0; };
  .${PREFIX}-expander { height: 100%; }
  .${PREFIX}-expander:after { display: block; content: ''; height: var(--scroll-height); }
`;

export default class Scroller {
  constructor({
    target,
    damping = 0.1
  }) {
    this.dom = {
      style: document.createElement('style'),
      wrapper: document.createElement('div'),
      container: document.createElement('div'),
      expander: document.createElement('div'),
      parent: target.parentElement,
      target,
    }
    this.damping = damping;
    this.currentTop = 0;
    this.lastTop = 0;
    this.onResize = this.onResize.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.observer = new ResizeObserver(this.onResize);
    this.wrap();
    this.start();
  }

  wrap() {
    const { target, parent, wrapper, container, expander, style } = this.dom;
    wrapper.classList.add(`${PREFIX}-wrapper`);
    container.classList.add(`${PREFIX}-container`);
    container.style.transform = 'translateY(var(--scroll-translateY))';
    expander.classList.add(`${PREFIX}-expander`);
    wrapper.appendChild(expander);
    wrapper.appendChild(container);
    container.appendChild(target);
    parent.appendChild(wrapper);
    style.innerHTML = CSS_STYLE;
    document.head.appendChild(style);
  }

  unwrap() {
    // TODO
  }

  start() {
    const { observer, dom } = this;
    observer.observe(dom.target);
    this.onUpdate();
  }

  stop() {
    const { observer, dom } = this;
    observer.unobserve(dom.target)
    cancelAnimationFrame(this.onUpdate);
  }

  onResize() {
    const { dom } = this;
    const { height } = dom.container.getBoundingClientRect();
    dom.expander.style.setProperty('--scroll-height', `${height}px`);
  }

  onScroll() {
    const { dom, currentTop } = this;
    dom.container.style.setProperty('--scroll-translateY', `${-currentTop}px`);
  }

  onUpdate() {
    const { damping } = this;
    requestAnimationFrame(this.onUpdate);
    const targetTop = window.scrollY || window.pageYOffset;
    this.lastTop = this.currentTop;
    this.currentTop = lerp(this.currentTop, targetTop, damping);
    this.currentTop = fixedDecimal(this.currentTop, 3);
    if (this.lastTop !== this.currentTop) {
      this.onScroll();
    }
  }
}