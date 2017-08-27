import React from 'react';
import PropTypes from 'prop-types';
import Label from '../Label/Label';

class LabelGroup extends React.Component {

  static propTypes = {
    positions: PropTypes.object.isRequired,
    orbitals: PropTypes.array.isRequired
  }
  
  getOrbitalLabels = (orbitals) => {
    let labels = [];

    orbitals.forEach((orbital) => {
      labels.push(
        <Label
          position={this.props.positions[orbital.id]}
          orbital={orbital}
          key={orbital.id}
        />
      );

      if (orbital.children) {
        labels = labels.concat(this.getOrbitalLabels(orbital.children));
      }
    });

    return labels;
  }

  render() {
    return <div>{this.getOrbitalLabels(this.props.orbitals)}</div>;
  }
}

export default LabelGroup;
