import React from 'react';
import ReactAnimationFrame from 'react-animation-frame';
import PropTypes from 'prop-types';
import Ellipse from '../utils/Ellipse';
import Label from '../utils/Label';
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
    atmosphere: PropTypes.number,
    id: PropTypes.string.isRequired,
    time: PropTypes.number,
    isSatellite: PropTypes.bool,
    active: PropTypes.bool
  }

  componentWillMount = () => {
    this.state = {};
    this.ellipse = new Ellipse(this.props);
    this.setGroupRotations(this.props);
    this.setBodyState(this.props, this.ellipse);
    this.setPathOpacity();
  }

  setPathOpacity = (active) => {
    this.setState({
      pathOpacity: Service.getPathOpacity(active)
    });
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

  getLabel = () => {
    const {action, name, domEvents, id, isSatellite} = this.props;
    const label = new Label(name, domEvents, isSatellite);

    label.onClick(action.setActiveOrbital.bind(this, id));
    label.onHover(this.setPathOpacity.bind(this, true));
    label.onMouseOut(this.setPathOpacity.bind(this, false));

    return label;
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
        atmosphere={this.props.atmosphere}
        label={this.getLabel()}
        id={this.props.id}>
        {this.props.children}
      </Orbital>
    );
  }
}

export default OrbitalContainer;