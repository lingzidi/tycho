import reducer from '../UIControlsReducer';
import ReduxService from '../../services/ReduxService';

describe('UIControls Reducer', () => {
  it('should return the state', () => {
    const state = {zoom: 10};
    const result = reducer(state, {});

    expect(result).toEqual(state);
  });

  it('should handle ZOOM_CHANGE', () => {
    const zoom = 10;
    const result = reducer(undefined, {
      type: 'ZOOM_CHANGE',
      zoom
    });

    expect(result).toEqual({zoom});
  });

  it('should handle SPEED_CHANGE', () => {
    const speed = 10;
    const result = reducer(undefined, {
      type: 'SPEED_CHANGE',
      speed
    });

    expect(result).toEqual({speed});
  });
});
