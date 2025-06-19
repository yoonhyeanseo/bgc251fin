(function (global) {
  global.P5Template = global.P5Template || {};
  class Paging {
    prevSelector;
    nextSelector;
    listSelector;
    myIdx;
    links;

    constructor(
      myIdx = 0,
      links = {
        home: '',
        pages: [],
      },
      options = {
        prevSelector: '#button-prev',
        nextSelector: '#button-next',
        listSelector: '#button-list',
      }
    ) {
      this.myIdx = myIdx;
      this.links = links;
      this.prevSelector = options.prevSelector || '#button-prev';
      this.nextSelector = options.nextSelector || '#button-next';
      this.listSelector = options.listSelector || '#button-list';

      window.addEventListener('DOMContentLoaded', () => {
        this.run();
      });
    }

    run() {
      const homePage = this.links.home;
      const listButton = document.querySelector(this.listSelector);
      if (homePage)
        listButton.addEventListener('click', () => {
          window.location.href = homePage;
        });

      const pages = this.links.pages;

      const prevPage = pages[(this.myIdx - 1) % pages.length];
      const prevButton = document.querySelector(this.prevSelector);
      if (prevPage)
        prevButton.addEventListener('click', () => {
          window.location.href = prevPage;
        });

      const nextPage = pages[(this.myIdx + 1) % pages.length];
      const nextButton = document.querySelector(this.nextSelector);
      if (nextPage)
        nextButton.addEventListener('click', () => {
          window.location.href = nextPage;
        });
    }
  }

  global.P5Template.Paging = Paging;
})(this);
