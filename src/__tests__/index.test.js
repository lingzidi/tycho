import React from 'react';
import toJson from 'enzyme-to-json';
// import index from '../index.js';

jest.mock('../components/App');

describe('Main Entry', () => {
  xit('should render without crashing', () => {
    expect(toJson(index)).toMatchSnapshot();
  });
});
