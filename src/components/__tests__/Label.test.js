import React from 'react';
import renderer from 'react-test-renderer';
import Label from '../Label';

describe('Label Component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Label text="foo" />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
