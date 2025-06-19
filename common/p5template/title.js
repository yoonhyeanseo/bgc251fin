(function (global) {
  global.P5Template = global.P5Template || {};

  class Title {
    title;
    designer;
    year;
    selectorTitle;
    selectorAuthor;

    /**
     * 작품 제목, 작가 성명, 작품 공개 연도를 받아 템플릿에 반영.
     *
     * @param {string} [title='키스의 고유 조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다'] - 작품 제목
     * @param {string} [designer='손우성'] - 작가 성명
     * @param {string} [year='2025'] - 작품 공개 연도
     * @param {Object} [options={ selectorTitle: '.title', selectorAuthor: '.author' }] - 옵션 객체 (선택):
     *   - selectorTitle: 제목 템플릿 요소 선택자 (기본값: '.title')
     *   - selectorAuthor: 저자 템플릿 요소 선택자 (기본값: '.author')
     */
    constructor(
      title = '키스의 고유 조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다',
      designer = '손우성',
      year = '2025',
      options = { selectorTitle: '.title', selectorAuthor: '.author' }
    ) {
      this.title = title;
      this.designer = designer;
      this.year = year;
      this.selectorTitle = options.selectorTitle || '.title';
      this.selectorAuthor = options.selectorAuthor || '.author';

      window.addEventListener('DOMContentLoaded', () => {
        this.run();
      });
    }

    #setHtmlTitle() {
      document.title = `${this.designer} - ${this.title}`;
    }

    #setHtmlBody() {
      document
        .querySelectorAll(this.selectorTitle)
        .forEach((el) => (el.textContent = this.title));

      document
        .querySelectorAll(this.selectorAuthor)
        .forEach((el) => (el.textContent = `${this.designer} (${this.year})`));
    }

    run() {
      this.#setHtmlTitle();
      this.#setHtmlBody();
    }
  }

  global.P5Template.Title = Title;
})(this);
