import React from 'react';
import {shallow} from 'enzyme';
import {Orbital} from '../Orbital';

describe('Orbital Component', () => {
  describe('updateScreenPositions()', () => {
    it('should call the updateScreenPosition callback prop', () => {
      const updateScreenPosition = jest.fn();
      const position = {};
      const rotation = {};

      const component = shallow(<Orbital
          updateScreenPosition={updateScreenPosition}
          eclipticGroupRotation={rotation}
          orbitalGroupRotation={rotation}
          pathVertices={[]}
          bodyPosition={position}
          bodyRotation={rotation}
          bodyRadius={1}
          id="testOrbital"
        />);

      const orbital = component.instance();

      orbital.onAnimationFrame();

      expect(updateScreenPosition).toHaveBeenCalled();
      expect(updateScreenPosition).toHaveBeenCalledTimes(1);
    });
  });
});
