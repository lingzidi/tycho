import Actions from '../constants/Actions';
import axios from 'axios';

export const requestOrbitalData = () => {
  return function(dispatch) {
    return axios
      .get('/static/data/orbitals.json')
      .then(({data}) => {
        dispatch({
          type: Actions.SET_ORBITAL_DATA,
          orbitalData: data
        });
      });
  }
}

export const requestPageText = () => {
  return function(dispatch) {
    return axios
      .get('/static/data/pageText.json')
      .then(({data}) => {
        dispatch({
          type: Actions.SET_PAGE_TEXT,
          pageText: data
        });
      });
  }
}
