(function (global) {
  global.P5Template = global.P5Template || {};

  class Scroll {
    topElemSelector;
    bottomElemSelector;
    buttonSelector;
    gate;
    gateInitCnt;
    prevIntersectionStateA;
    prevIntersectionStateB;

    constructor(
      options = {
        topElemSelector: '#section-canvas',
        bottomElemSelector: '#section-control',
        buttonSelector: '#button-scroll',
      }
    ) {
      this.topElemSelector = options.topElemSelector || '#section-canvas';
      this.bottomElemSelector =
        options.bottomElemSelector || '#section-control';
      this.buttonSelector = options.buttonSelector || '#button-scroll';
      this.gate = false;
      this.gateInitCnt = 0;
      this.prevIntersectionStateA = false;
      this.prevIntersectionStateB = false;

      window.addEventListener('DOMContentLoaded', () => {
        this.run();
      });
    }

    #disableScroll(elem) {
      elem.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );
      elem.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );
    }

    #scrollTo(elem, timeoutDuration = 1000) {
      elem.scrollIntoView({ behavior: 'smooth' });
      this.gate = false;
      setTimeout(() => {
        this.gate = true;
      }, timeoutDuration);
    }

    #registerButtonEvent(elem, topElem, bottomElem) {
      elem.addEventListener('click', () => {
        const towardDown = elem.dataset.toward === 'down';
        if (towardDown) {
          this.#scrollTo(bottomElem);
        } else {
          this.#scrollTo(topElem);
        }
      });
    }

    #observe(topElem, bottomElem, buttonElem) {
      const intersectionObserverA = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!this.prevIntersectionStateA && this.gate)
              this.#scrollTo(topElem);
            this.gateInitCnt++;
            if (this.gateInitCnt === 2) this.gate = true;
          } else {
            if (this.prevIntersectionStateB) buttonElem.dataset.toward = 'up';
          }
          this.prevIntersectionStateA = entry.isIntersecting;
        },
        { threshold: [0, 1], rootMargin: '-2px 0px 0px 0px' }
      );
      intersectionObserverA.observe(topElem);

      const intersectionObserverB = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (this.prevIntersectionStateA) {
              if (this.gate) this.#scrollTo(bottomElem);
              buttonElem.dataset.toward = 'down';
            }
            this.gateInitCnt++;
            if (this.gateInitCnt === 2) this.gate = true;
          }
          this.prevIntersectionStateB = entry.isIntersecting;
        },
        { threshold: [0, 1], rootMargin: '0px 0px -2px 0px' }
      );
      intersectionObserverB.observe(topElem);
    }

    run() {
      const topElem = document.querySelector(this.topElemSelector);
      const bottomElem = document.querySelector(this.bottomElemSelector);
      const buttonElem = document.querySelector(this.buttonSelector);
      this.#disableScroll(topElem);
      this.#disableScroll(bottomElem);
      this.#registerButtonEvent(buttonElem, topElem, bottomElem);
      this.#observe(topElem, bottomElem, buttonElem);
    }
  }

  global.P5Template.Scroll = Scroll;
})(this);
