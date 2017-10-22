import DomEvents from '../DomEvents';
import {Camera} from 'three';

global.document = {
  querySelector: () => ({})
}

describe('DomEvents()', () => {
  let events;
  
  beforeEach(() => {
    events = DomEvents(new Camera());
  });

  it('should be an object', () => {
    expect(typeof events).toBe('object');
  });
});