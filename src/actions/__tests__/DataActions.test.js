import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as Actions from '../DataActions';
import ActionType from '../../constants/Actions';
import orbitalFixtures from './__fixtures__/orbitals.json';
import pageTextFixtures from './__fixtures__/pageText.json';

const mock = new MockAdapter(axios);

describe('Data Actions', () => {
  describe('requestOrbitalData()', () => {
    it('should be a thunk', () => {
      expect(typeof Actions.requestOrbitalData()).toBe('function');
    });

    it('should request orbitals.json', () => {
      mock.onGet('/static/data/orbitals.json').reply(200, orbitalFixtures);

      const dispatch = (data) => {
        expect(data).toEqual({
          type: ActionType.SET_ORBITAL_DATA,
          orbitalData: orbitalFixtures
        });
      };
      Actions.requestOrbitalData()(dispatch);
    });
  });

  describe('requestPageText()', () => {
    it('should be a thunk', () => {
      expect(typeof Actions.requestPageText()).toBe('function');
    });

    it('should request pageText.json', () => {
      mock.onGet('/static/data/pageText.json').reply(200, pageTextFixtures);

      const dispatch = (data) => {
        expect(data).toEqual({
          type: ActionType.SET_PAGE_TEXT,
          pageText: pageTextFixtures
        });
      };
      Actions.requestPageText()(dispatch);
    });
  });
});
 
