import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import Orbital from './Orbital';

describe('Orbital Component', () => {
  let component, orbital, updatePosition;

  beforeEach(() => {
    const position = {};
    const rotation = {};

    updatePosition = jest.fn();

    component = shallow(<Orbital
      updatePosition={updatePosition}
      eclipticGroupRotation={rotation}
      orbitalGroupRotation={rotation}
      pathVertices={[]}
      bodyPosition={position}
      bodyRotation={rotation}
      bodyRadius={1}
      id="testOrbital"
      text="Test Orbital"
      action={{}}
    />);

    orbital = component.instance();
  });

  describe('render()', () => {
    it('should render the orbital successfully', () => {
      expect(toJson(component)).toMatchSnapshot();
    });
  });
});
