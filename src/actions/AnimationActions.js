import Actions from '../constants/Actions';

export const setPosition = (position, id) => {
  return {
    type: Actions.SET_POSITION,
    position,
    id
  };
}

export const setTime = (time) => {
  return {
    type: Actions.SET_TIME,
    time
  };
}
