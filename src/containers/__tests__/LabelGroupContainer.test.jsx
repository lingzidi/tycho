import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {LabelGroupContainer} from '../LabelGroupContainer';
import data from '../../global/fixtures';

describe('Label Group Container', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <LabelGroupContainer
        orbitalData={data}
        positions={{}}
      />);
  });
  
  it('should render the LabelGroup successfully', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
