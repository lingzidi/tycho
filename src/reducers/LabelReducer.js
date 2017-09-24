import ReduxService from '../services/ReduxService';
import Actions from '../constants/Actions';

export default function(state = {}, payload) {
  const assign = (...props) => ReduxService.assign(state, payload, ...props);

  switch(payload.type) {
    case Actions.SET_ACTIVE_ORBITAL:
      return assign('targetName');
    case Actions.SET_HIGHLIGHTED_ORBITAL:
      return assign('highlightedOrbital');
    default:
      return state;
  }
}
