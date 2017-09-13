import Actions from '../constants/Actions';

export const setActiveOrbital = (targetName) => {
  return {
    type: Actions.SET_ACTIVE_ORBITAL,
    targetName
  };
}
