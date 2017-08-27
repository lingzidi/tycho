import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import PropTypes from 'prop-types';
import Ellipse from '../components/Scene/Utils/Ellipse';
import Orbital from '../components/Scene/Objects/Orbital';
import Service from '../services/OrbitalService';

class OrbitalContainer extends React.Component {

  static propTypes = {
    inclination: PropTypes.number.isRequired,
    longAscNode: PropTypes.number.isRequired,
    argPeriapsis: PropTypes.number.isRequired,
    arcRotate: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    axialTilt: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    odd: PropTypes.bool,
    camera: PropTypes.object
  }

  componentWillMount = () => {
    this.state = {};
    this.ellipse = new Ellipse(this.props);

    this.setGroupRotations(this.props);
    this.setBodyState(this.props, this.ellipse);
  }

  onAnimationFrame = () => {
    this.setBodyState(this.props, this.ellipse);
  }

  setGroupRotations = (props) => {
    this.setState({
      eclipticGroupRotation: Service.getEclipticGroupRotation(props),
      orbitalGroupRotation: Service.getOrbitalGroupRotation(props)
    });
  }

  setBodyState = (props, ellipse) => {
    this.setState({
      bodyRotation: Service.getBodyRotation(props),
      bodyPosition: Service.getBodyPosition(props, ellipse),
      bodyRadius: Service.getBodyRadius(props)
    });
  }

  updateScreenPosition = (mesh) => {
    const coords = Service.getWorldPosition(mesh);
    const screen = Service.translateWorldToScreen(coords, this.props.camera);

    this.props.onUpdate(screen, this.props.id);
  }

  render() {
    return (
      <Orbital
        updateScreenPosition={this.updateScreenPosition}
        eclipticGroupRotation={this.state.eclipticGroupRotation}
        orbitalGroupRotation={this.state.orbitalGroupRotation}
        pathVertices={this.ellipse.geometry.vertices}
        bodyPosition={this.state.bodyPosition}
        bodyRotation={this.state.bodyRotation}
        bodyRadius={this.state.bodyRadius}
        id={this.props.id}>
        {this.props.children}
      </Orbital>
    );
  }
}

export default ReactAnimationFrame(OrbitalContainer);
