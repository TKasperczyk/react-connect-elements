// helper functions, it turned out chrome doesn't support Math.sgn()
export const signum = x => (x < 0 ? -1 : 1);
export const absolute = x => (x < 0 ? -x : x);

export const drawPath = (
  svg,
  path,
  startX,
  startY,
  endX,
  endY,
  svgHeight,
  color
) => {
  // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)

  const stroke = parseFloat(path.getAttribute('stroke-width'));
  // check if the svg is big enough to draw the path, if not, set heigh/width
  svg.setAttribute('height', svgHeight);
  svg.setAttribute('width', endX + stroke);

  const deltaX = (endX - startX) * 0.25;
  // const deltaY = (endY - startY) * 0.15;

  // for further calculations which ever is the shortest distance
  // const delta = deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

  // set sweep-flag (counter/clock-wise)
  // if start element is closer to the left edge,
  // draw the first arc counter-clockwise, and the second one clock-wise
  /* let arc1 = 0;
  let arc2 = 1;
  if (startX > endX) {
    arc1 = 1;
    arc2 = 0;
  } */

  // draw tha pipe-like path
  // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end
  path.setAttribute(
    'd',
    `M${startX} ${startY} 
     H ${startX + deltaX} 
     Q ${startX + 2 * deltaX} ${startY} ${startX + 2 * deltaX} ${(endY +
      startY) /
      2}
     Q ${startX + 2 * deltaX} ${endY} ${startX + 4 * deltaX} ${endY}
     H ${endX + deltaX} 
     `
  );
  /* path.setAttribute(
    'style',
    `stroke: ${color}`
  ); */

  /*
  path.setAttribute(
    'd',
    `M${startX} ${startY} V${startY +
      delta} A${delta} ${delta} 0 0 ${arc1} ${startX +
      delta * signum(deltaX)} ${startY + 2 * delta} H${endX -
      delta * signum(deltaX)} A${delta} ${delta} 0 0 ${arc2} ${endX} ${startY +
      3 * delta} V${endY}`
  );
  */
};

export const connectElements = (
  container,
  svg,
  path,
  startElem,
  endElem,
  color
) => {
  // if first element is further than the second, swap!
  if (
    startElem.getBoundingClientRect().left >
    endElem.getBoundingClientRect().left
  ) {
    const temp = startElem;
    startElem = endElem;
    endElem = temp;
  }

  // get (top, left) corner coordinates of the svg container
  const svgTop = container.getBoundingClientRect().top;
  const svgLeft = container.getBoundingClientRect().left;
  const svgHeight = container.getBoundingClientRect().height;

  // get (top, left) coordinates for the two elements
  const startCoord = startElem.getBoundingClientRect();
  const endCoord = endElem.getBoundingClientRect();

  // calculate path's start (x,y)  coords
  // we want the x coordinate to visually result in the element's mid point
  const startX = startCoord.left + 0.5 * startCoord.width - svgLeft; // x = left offset + 0.5*width - svg's left offset
  const startY = startCoord.top + startCoord.height / 2 - svgTop; // y = top offset + height - svg's top offset

  // calculate path's end (x,y) coords
  const endX = endCoord.left + 0.5 * endCoord.width - svgLeft;
  const endY = endCoord.top + endCoord.height / 2 - svgTop;

  // call function for drawing the path
  drawPath(svg, path, startX, startY, endX, endY, svgHeight, color);
};
