// import ReduxService from '../services/ReduxService';
import Actions from '../constants/Actions';

export default function(state = {}, payload) {
  // const assign = (...props) => ReduxService.assign(state, payload, ...props);

  switch(payload.type) {
    case Actions.SET_POSITION:
      let positions = {[payload.id]: payload.position};

      if (state.positions) {
        positions = Object.assign({}, state.positions, positions);
      }

      return Object.assign({}, state, {positions});
    default:
      return state;
  }
}
