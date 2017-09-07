import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import PropTypes from 'prop-types';
import Ellipse from '../utils/Ellipse';
import Service from '../services/OrbitalService';
import Orbital from '../components/Orbital';

export class OrbitalContainer extends React.Component {

  static propTypes = {
    inclination: PropTypes.number.isRequired,
    longAscNode: PropTypes.number.isRequired,
    argPeriapsis: PropTypes.number.isRequired,
    arcRotate: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    axialTilt: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isSatellite: PropTypes.bool,
    active: PropTypes.bool,
    camera: PropTypes.object,
    updatePosition: PropTypes.func.isRequired
  }

  componentWillMount = () => {
    this.state = {};
    this.ellipse = new Ellipse();
    this.setEllipseScale();
    this.setGroupRotations(this.props);
    this.onAnimationFrame();
  }

  componentDidUpdate = () => {
    const {scale} = this.props;

    if (scale) {
      this.setEllipseScale(scale);
    }
  }

  setEllipseScale = (scale) => {
    if (this.props.isSatellite) {
      this.ellipse.scale({...this.props, scale});
    }
    this.ellipse.scale(this.props);
  }

  setPathOpacity = (active) => {
    const pathOpacity = active ? 1 : 0.2;

    this.setState({pathOpacity});
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

  updatePosition = (mesh) => {
    const position3d = Service.getWorldPosition(mesh);
    const position2d = Service.translateWorldToScreen(position3d, this.props.camera);

    this.props.updatePosition({position2d, position3d}, this.props.id);
  }

  onAnimationFrame = () => {
    this.setBodyState(this.props, this.ellipse);
    this.setPathOpacity(this.props.active);
  }

  render() {
    return (
      <Orbital
        eclipticGroupRotation={this.state.eclipticGroupRotation}
        orbitalGroupRotation={this.state.orbitalGroupRotation}
        pathVertices={this.ellipse.geometry.vertices}
        bodyPosition={this.state.bodyPosition}
        bodyRotation={this.state.bodyRotation}
        bodyRadius={this.state.bodyRadius}
        pathOpacity={this.state.pathOpacity}
        updatePosition={this.updatePosition}
        id={this.props.id}>
        {this.props.children}
      </Orbital>
    );
  }
}

export default ReactAnimationFrame(OrbitalContainer);
