import React from 'react';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import LabelGroup from './LabelGroup';
import data from '../../global/fixtures';

describe('Label Component', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <LabelGroup
        orbitalData={data}
        positions={{}}
      />);
  });
  
  it('should render the LabelGroup successfully', () => {
    expect(toJson(component)).toMatchSnapshot();
  });
});
