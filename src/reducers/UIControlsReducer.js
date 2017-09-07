import ReduxService from '../services/ReduxService';

export default function(state = {}, payload) {
  const assign = (...props) => ReduxService.assign(state, payload, ...props);

  switch(payload.type) {
    case 'ZOOM_CHANGE':
      return assign('zoom');
    case 'SPEED_CHANGE':
      return assign('speed');
    default:
      return state;
  }
}

