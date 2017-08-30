import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {Orbital} from '../Orbital';

describe('Orbital Component', () => {
  let component, orbital, updateScreenPosition;

  beforeEach(() => {
    const position = {};
    const rotation = {};

    updateScreenPosition = jest.fn();

    component = shallow(<Orbital
      updateScreenPosition={updateScreenPosition}
      eclipticGroupRotation={rotation}
      orbitalGroupRotation={rotation}
      pathVertices={[]}
      bodyPosition={position}
      bodyRotation={rotation}
      bodyRadius={1}
      id="testOrbital"
    />);

    orbital = component.instance();
  });

  describe('updateScreenPositions()', () => {
    it('should call the updateScreenPosition callback prop', () => {
      orbital.onAnimationFrame();

      expect(updateScreenPosition).toHaveBeenCalled();
      expect(updateScreenPosition).toHaveBeenCalledTimes(1);
    });
  });

  describe('render()', () => {
    it('should render the orbital successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
