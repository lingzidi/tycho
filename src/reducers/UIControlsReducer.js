import ReduxService from '../services/ReduxService';
import Actions from '../constants/Actions';

export default function(state = {}, payload) {
  const assign = (...props) => ReduxService.assign(state, payload, ...props);

  switch(payload.type) {
    case Actions.ZOOM_CHANGE:
      return assign('zoom');
    case Actions.SPEED_CHANGE:
      return assign('speed');
    case Actions.SCALE_CHANGE:
      return assign('scale');
    case Actions.TIME_OFFSET_CHANGE:
      return assign('timeOffset');
    default:
      return state;
  }
}
