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
