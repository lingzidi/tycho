import Actions from '../constants/Actions';

export const setActiveOrbital = (targetName) => {
  return {
    type: Actions.SET_ACTIVE_ORBITAL,
    targetName
  };
}

export const setLabelText = (labelText) => {
  return {
    type: Actions.SET_LABEL_TEXT,
    labelText
  };
}

export const setHighlightedOrbital = (highlightedOrbital) => {
  return {
    type: Actions.SET_HIGHLIGHTED_ORBITAL,
    highlightedOrbital
  };
}
