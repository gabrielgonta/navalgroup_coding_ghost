import React from 'react';

// Fonction pour créer les mobiles sous formes graphiques selon leur forme et couleur
const Mobile = React.memo(({ shape, color, xM, yM, headingRad, orientationRad, onClick, isSelected }) => {
    let fillColor = 'black';
    let strokeColor = 'black';
    let strokeWidth = {isSelected}

  switch (color) {
    case 'RED':
      fillColor = 'red';
      break;
    case 'YELLOW':
      fillColor = 'yellow';
      break;
    case 'ORANGE':
      fillColor = 'orange';
      break;
    case 'GREEN':
      fillColor = 'green';
      break;
    case 'BLUE':
      fillColor = 'blue';
      break;
    case 'VIOLET':
      fillColor = 'violet';
      break;
    default:
      fillColor = 'black';
  }

  let x = (xM + 10000) / 20000 * 500;
  let y = 500 - (yM + 10000) / 20000 * 500;

  let shapeElement;
  switch (shape) {
    case 'SQUARE':
      shapeElement = <rect x={x - 5} y={y - 5} width="10" height="10" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />;
      break;
    case 'CIRCLE':
      shapeElement = <circle cx={x} cy={y} r="5" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />;
      break;
    case 'TRIANGLE':
      shapeElement = <polygon points={`${x},${y - 5} ${x + 5},${y + 5} ${x - 5},${y + 5}`} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />;
      break;
    case 'DIAMOND':
      shapeElement = <polygon points={`${x},${y - 5} ${x + 5},${y} ${x},${y + 5} ${x - 5},${y}`} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />;
      break;
    default:
      shapeElement = null;
  }

  const adjustedOrientationRad = orientationRad - Math.PI / 2;
  const orientationVector = (
    <line
      x1={x}
      y1={y}
      x2={x + Math.cos(adjustedOrientationRad) * 10}
      y2={y + Math.sin(adjustedOrientationRad) * 10}
      stroke="black"
      strokeWidth={strokeWidth}
    />
  );

  const adjustedHeadingRad = headingRad - Math.PI / 2;

  const headingVector = (
    <line
      x1={x}
      y1={y}
      x2={x + Math.cos(adjustedHeadingRad) * 10}
      y2={y + Math.sin(adjustedHeadingRad) * 10}
      stroke="black"
      strokeWidth="2"
    />
  );

  return (
    <g onClick={onClick}>
      {headingVector}
      {orientationVector}
      {shapeElement}
      {isSelected && <circle cx={x} cy={y} r="12" fill="none" stroke="black" strokeWidth="2" />}
    </g>
  );
});

export default Mobile;
