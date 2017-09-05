import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';

class LabelGroup extends React.Component {

  static propTypes = {
    positions: PropTypes.object.isRequired,
    orbitalData: PropTypes.array.isRequired
  }
  
  getOrbitalLabels = (orbitals) => {
    return orbitals.map((orbital) => {
      return (
        <Label
          position={this.props.positions[orbital.id]}
          text={orbital.name}
          key={orbital.id}>
          {orbital.satellites && this.getOrbitalLabels(orbital.satellites)}
        </Label>
      );
    });
  }

  render() {
    return <div>{this.getOrbitalLabels(this.props.orbitalData)}</div>;
  }
}

export default LabelGroup;
