import reducer from '../LabelReducer';
import ReduxService from '../../services/ReduxService';
import Actions from '../../constants/Actions';

describe('Label Reducer', () => {
  it('should return the state', () => {
    const state = {targetName: 'Mars'};
    const result = reducer(state, {});

    expect(result).toEqual(state);
  });

  it('should handle SET_ACTIVE_ORBITAL', () => {
    const targetName = 'Mars';
    const result = reducer(undefined, {
      type: Actions.SET_ACTIVE_ORBITAL,
      targetName
    });

    expect(result).toEqual({targetName});
  });
});
