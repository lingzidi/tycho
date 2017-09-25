import React from 'react';
import toJson from 'enzyme-to-json';
import index from '../index.js';

jest.mock('../containers/AppContainer');

describe('Main Entry', () => {
  it('should render without crashing', () => {
    expect(toJson(index)).toMatchSnapshot();
  });
});
