import React from 'react';
import Label from './Label';
import renderer from 'react-test-renderer';

describe('Label Component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Label text="foo" />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
