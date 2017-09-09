export const changeZoom = (zoom) => {
  return {
    type: 'ZOOM_CHANGE',
    zoom
  };
}

export const changeSpeed = (speed) => {
  return {
    type: 'SPEED_CHANGE',
    speed
  };
}

export const changeScale = (scale) => {
  return {
    type: 'SCALE_CHANGE',
    scale
  };
}

export const changeTimeOffset = (timeOffset) => {
  return {
    type: 'TIME_OFFSET_CHANGE',
    timeOffset
  };
}
