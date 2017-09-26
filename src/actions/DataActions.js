import Actions from '../constants/Actions';

export const requestOrbitalData = () => {
  return function(dispatch) {
    return fetch('/static/data/orbitals.json')
      .then((res) => res.json())
      .then((orbitalData) => {
        dispatch({
          type: Actions.SET_ORBITAL_DATA,
          orbitalData
        });
      });
  }
}

export const requestPageText = () => {
  return function(dispatch) {
    return fetch('/static/data/pageText.json')
      .then((res) => res.json())
      .then((pageText) => {
        dispatch({
          type: Actions.SET_PAGE_TEXT,
          pageText
        });
      });
  }
}
