import reducer from '../AnimationReducer';
import ReduxService from '../../services/ReduxService';
import Actions from '../../constants/Actions';

describe('Animation Reducer', () => {
  it('should return the state', () => {
    const state = {positions: {}};
    const result = reducer(state, {});

    expect(result).toEqual(state);
  });

  describe('SET_POSITION', () => {
    it('should assign the new positions to the existing state positions', () => {
      const positions = {
        Earth: {}
      };
      const id = 'Mars';
      const position = {x: 1, y: 2, z: 3};  
      const result = reducer({positions}, {
        type: Actions.SET_POSITION,
        position,
        id
      });

      expect(result).toEqual({positions: {...positions, [id]: position}});
    });

    it('should assign a new set of positions to the reducer, if no state positions exist', () => {
      const position = {x: 1, y: 2, z: 3};
      const id = 'Earth';
      const positions = {[id]: position};
      
      const result = reducer(undefined, {
        type: Actions.SET_POSITION,
        position,
        id
      });

      expect(result).toEqual({positions});
    });
  });

  it('should handle SET_TIME', () => {
    const time = 1;
    const result = reducer(undefined, {
      type: Actions.SET_TIME,
      time
    });

    expect(result).toEqual({time});
  });
});
