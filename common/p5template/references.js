(function (global) {
  global.P5Template = global.P5Template || {};

  class References {
    references;
    olSelector;

    /**
     * 참고자료 목록을 템플릿에 반영.
     *
     * @param {Array<{
     *   title: string,
     *   authors: string[],
     *   year: string,
     *   publisher: string,
     *   url?: string,
     *   translators?: string[]
     * }>} references - 참고자료 객체 배열. 각 항목은 다음과 같은 속성을 가짐:
     *   - title: 참고자료 제목
     *   - authors: 저자이름 배열
     *   - year: 출판연도 문자열
     *   - publisher: 출판사 이름
     *   - url (선택): URL
     *   - translators (선택): 번역자이름 배열
     *
     * @param {{
     *   olSelector?: string
     * }} [options] - 옵션 객체 (선택):
     *   - olSelector: 참고자료가 삽입될 ol 요소의 CSS 선택자 (기본값: '.information__reference ol')
     */
    constructor(
      references = [
        {
          title: 'What was Coding like 40 years ago?',
          authors: ['Daniel Shiffman'],
          year: '2022',
          publisher: 'The Coding Train - YouTube',
          url: 'https://www.youtube.com/watch?v=7r83N3c2kPw',
        },
        {
          title: '250425a',
          authors: ['Okazz'],
          year: '2025',
          publisher: 'OpenProcessing',
          url: 'https://openprocessing.org/sketch/2625827',
        },
        {
          title:
            'Nature of Code 자연계 법칙을 디지털 세계로 옮기는 컴퓨터 프로그래밍 전략',
          authors: ['다니엘 쉬프만'],
          translators: ['윤인성'],
          year: '2015',
          publisher: '한빛미디어',
        },
      ],
      options = { olSelector: '.information__reference ol' }
    ) {
      this.references = references;
      this.olSelector = options.olSelector || '.information__reference ol';

      window.addEventListener('DOMContentLoaded', () => {
        this.run();
      });
    }

    #setHtmlBody() {
      const ol = document.querySelector(this.olSelector);
      const formatAPA = (item) => {
        const italic = (text) => `<i>${text}</i>`;
        const authorStr = item.authors.join(', ');
        const yearStr = `(${item.year})`;
        const title = item.url
          ? `<i><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></i>`
          : italic(item.title);
        const titleStr = item.translators
          ? `${title} (${item.translators.join(', ')}, 역)`
          : title;

        return `${authorStr}. ${yearStr}. ${titleStr}. ${item.publisher}.`;
      };
      ol.innerHTML = '';
      this.references.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = formatAPA(item);
        ol.appendChild(li);
      });
    }

    run() {
      this.#setHtmlBody();
    }
  }

  global.P5Template.References = References;
})(this);
