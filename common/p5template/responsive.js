(function (global) {
  global.P5Template = global.P5Template || {};

  class Responsive {
    containerSelector;

    constructor(options = { containerSelector: '#canvas-container' }) {
      this.containerSelector = options.containerSelector || '#canvas-container';
    }

    /**
     * 지정된 맞춤 방식에 따라 캔버스를 컨테이너에 최적으로 맞추기 위한 크기를 반환.
     *
     * @param {{ width: number, height: number }} canvasSize - 캔버스의 원래 크기.
     * @param {{ width: number, height: number }} containerSize - 캔버스를 맞출 컨테이너의 크기.
     * @param {'contain' | 'fill' | 'cover' | 'none' | 'scale-down'} [canvasFit='contain'] - 캔버스가 컨테이너에 맞춰지는 방식:
     * - 'contain': 캔버스의 비율을 유지하면서 컨테이너 안에 완전히 들어가도록 크기를 조정.
     * - 'fill': 캔버스의 비율을 무시하고 컨테이너의 크기에 맞춤.
     * - 'cover': 캔버스의 비율을 유지하면서 컨테이너를 완전히 덮도록 크기를 조정.
     * - 'none': 크기 조정을 하지 않음.
     * - 'scale-down': 캔버스가 컨테이너보다 클 때만 'contain'과 같은 방식으로 크기를 줄임.
     * @returns {{ width: number, height: number }} 계산된 캔버스의 너비와 높이.
     */
    #getFitSize(canvasSize, containerSize, canvasFit = 'contain') {
      const { width: canvasWidth, height: canvasHeight } = canvasSize;
      const { width: containerWidth, height: containerHeight } = containerSize;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      const containerAspectRatio = containerWidth / containerHeight;
      const size = { width: 0, height: 0 };
      switch (canvasFit) {
        case 'contain':
          if (containerAspectRatio > canvasAspectRatio) {
            size.height = containerHeight;
            size.width = Math.floor(size.height * canvasAspectRatio);
          } else {
            size.width = containerWidth;
            size.height = Math.floor(size.width / canvasAspectRatio);
          }
          break;
        case 'fill':
          size.width = containerWidth;
          size.height = containerHeight;
          break;
        case 'cover':
          if (containerAspectRatio > canvasAspectRatio) {
            size.width = containerWidth;
            size.height = Math.ceil(size.width / canvasAspectRatio);
          } else {
            size.height = containerHeight;
            size.width = Math.ceil(size.height * canvasAspectRatio);
          }
          break;
        case 'none':
          size.width = canvasWidth;
          size.height = canvasHeight;
          break;
        case 'scale-down':
          if (containerWidth < canvasWidth || containerHeight < canvasHeight) {
            if (containerAspectRatio > canvasAspectRatio) {
              size.height = containerHeight;
              size.width = Math.floor(size.height * canvasAspectRatio);
            } else {
              size.width = containerWidth;
              size.height = Math.floor(size.width / canvasAspectRatio);
            }
          } else {
            size.width = canvasWidth;
            size.height = canvasHeight;
          }
          break;
      }
      return size;
    }

    /**
     * 지정한 컨테이너 요소 내에 지정된 맞춤 방식에 따라 조정되는 반응형 p5.js 캔버스를 생성.
     *
     * @param {number} width - 캔버스의 기준 너비(픽셀, 양의 정수).
     * @param {number} height - 캔버스의 기준 높이(픽셀, 양의 정수).
     * @param {string} containerSelector - 캔버스를 넣을 컨테이너 요소의 선택자 문자열.
     * @param {'contain' | 'fill' | 'cover' | 'none' | 'scale-down'} [canvasFit='none'] - 캔버스가 컨테이너에 맞춰지는 방식:
     * - 'contain': 캔버스의 비율을 유지하면서 컨테이너 안에 완전히 들어가도록 크기를 조정.
     * - 'fill': 캔버스의 비율을 무시하고 컨테이너의 크기에 맞춤(staticCoordinate가 true일 경우 이미지가 왜곡됨).
     * - 'cover': 캔버스의 비율을 유지하면서 컨테이너를 완전히 덮도록 크기를 조정.
     * - 'none': 크기 조정을 하지 않음.
     * - 'scale-down': 캔버스가 컨테이너보다 클 때만 'contain'과 같은 방식으로 크기를 줄임.
     * @param {boolean} [staticCoordinate=true] - true면 캔버스 좌표계가 확장, 수축되지 않고, 렌더링된 이미지 크기가 확대, 축소됨(확대시 이미지 열화), false면 캔버스 좌표계가 확장, 수축(좌표계 변경에 대응되는 코딩 요구).
     * @param {P2D | WEBGL} [renderOption= P2D] - p5.js 렌더러 (기본값: P2D)
     * @returns {p5.Renderer | undefined} 생성된 p5.Renderer 객체 또는 오류 시 undefined 반환.
     */
    createResponsiveCanvas(
      width,
      height,
      canvasFit = 'none',
      staticCoordinate = true,
      renderOption = P2D
    ) {
      const fnName = 'createResponsiveCanvas';
      if (!Number.isInteger(width) || !Number.isInteger(height)) {
        console.error(
          `@${fnName}(): 1, 2번째 매개변수 width, height는 양의 정수여야합니다.`
        );
        return;
      }
      if (
        !['contain', 'fill', 'cover', 'none', 'scale-down'].includes(canvasFit)
      ) {
        console.error(
          `@${fnName}(): 3번째 매개변수 canvasFit은 "contain", "cover", "none", "scale-down" 중 하나여야 합니다.`
        );
        return;
      }
      if (typeof staticCoordinate !== 'boolean') {
        console.error(
          `@${fnName}(): 4번째 매개변수 staticCoordinate는 true 또는 false여야 합니다.`
        );
        return;
      }
      const container = document.querySelector(this.containerSelector);
      if (!container) {
        console.error(
          `@${fnName}(): "${this.containerSelector}"와 일치하는 HTML 요소가 없습니다.`
        );
        return;
      }

      const { width: fitWidth, height: fitHeight } = this.#getFitSize(
        { width, height },
        container.getBoundingClientRect(),
        canvasFit
      );
      const finalSize = {
        width: staticCoordinate ? width : fitWidth,
        height: staticCoordinate ? height : fitHeight,
      };
      const renderer = createCanvas(
        finalSize.width,
        finalSize.height,
        renderOption
      );
      const canvas = renderer.elt;
      renderer.parent(container);

      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
      container.style.overflow = 'clip';
      canvas.style.width = `${fitWidth}px`;
      canvas.style.height = `${fitHeight}px`;

      if (canvasFit === 'none') return renderer;

      const resizeObserver = new ResizeObserver(([entry]) => {
        if (entry.target === container) {
          const { width: canvasWidth, height: canvasHeight } = this.#getFitSize(
            { width, height },
            entry.target.getBoundingClientRect(),
            canvasFit
          );
          if (!staticCoordinate) resizeCanvas(canvasWidth, canvasHeight);
          renderer.elt.style.width = `${canvasWidth}px`;
          renderer.elt.style.height = `${canvasHeight}px`;
        }
      });
      resizeObserver.observe(container);

      console.log(
        `@${fnName}(): 캔버스가 생성되었습니다.
  - 캔버스 크기: ${finalSize.width}x${finalSize.height}px
  - 컨테이너: ${container}
  - 캔버스 맞춤 방식: ${canvasFit}
  - 고정 좌표계: ${staticCoordinate}`
      );

      return renderer;
    }

    static #isColor(value) {
      if (
        typeof value === 'number' ||
        (Array.isArray(value) &&
          value.length > 0 &&
          value.every((e) => typeof e === 'number'))
      ) {
        return true;
      }
      return CSS.supports('color', value);
    }

    /**
     * 캔버스에 기준선, 중앙선, 경계선을 포함한 참조 그리드를 그립니다.
     *
     * @param {(number | string | number[])} [boundaryColour='#000000'] - 경계선의 색상. 숫자, 색상 문자열, 숫자 배열을 허용.
     * @param {(number | string | number[])} [gridColour='#888888'] - 격자선의 색상. 숫자, 색상 문자열, 숫자 배열을 허용.
     * @param {(number | string | number[])} [centerColour='red'] - 중심선의 색상. 숫자, 색상 문자열, 숫자 배열을 허용.
     * @param {number} [gridSize=20] - 그리드 간격(픽셀).
     */
    static drawReferenceGrid(
      boundaryColour = '#000000',
      gridColour = '#888888',
      centerColour = 'red',
      gridSize = 20
    ) {
      const fnName = 'drawReferenceGrid';
      if (
        !Responsive.#isColor(boundaryColour) ||
        !Responsive.#isColor(gridColour) ||
        !Responsive.#isColor(centerColour)
      ) {
        console.error(
          `@${fnName}(): 1~3번째 매개변수는 색상을 나타내는 숫자, 숫자 배열 혹은 CSS에서 색상을 특정하는 문자열이어야 합니다.`
        );
        return;
      }
      noFill();
      stroke(gridColour);
      strokeWeight(1);
      for (let x = gridSize; x < width; x += gridSize) {
        line(x, 0, x, height);
      }
      for (let y = gridSize; y < height; y += gridSize) {
        line(0, y, width, y);
      }
      stroke(centerColour);
      line(width / 2, 0, width / 2, height);
      line(0, height / 2, width, height / 2);
      stroke(boundaryColour);
      strokeWeight(gridSize);
      rect(0, 0, width, height);
    }
  }

  global.P5Template.Responsive = Responsive;
})(this);
