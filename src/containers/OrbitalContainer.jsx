import React from 'react';
import PropTypes from 'prop-types';
import Ellipse from '../utils/Ellipse';
import Label from 'three-dom-label';
import Service from '../services/OrbitalService';
import Orbital from '../components/Orbital';

export class OrbitalContainer extends React.Component {

  static propTypes = {
    inclination: PropTypes.number.isRequired,
    longitudeOfAscendingNode: PropTypes.number.isRequired,
    argumentOfPeriapsis: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    axialTilt: PropTypes.number.isRequired,
    atmosphere: PropTypes.number,
    sidereal: PropTypes.number,
    id: PropTypes.string.isRequired,
    time: PropTypes.number,
    isSatellite: PropTypes.bool,
    active: PropTypes.bool,
    highlightedOrbitals: PropTypes.array,
    maps: PropTypes.array
  }

  componentWillMount = () => {
    this.ellipse = new Ellipse(this.props);
    this.label = this.getLabel();

    this.setGroupRotations(this.props);
    this.setPathOpacity(this.props);
    this.setBodyState(this.props, this.ellipse);
    this.setState({});
  }

  componentWillUnmount = () => this.label.unmount()

  componentWillReceiveProps = (nextProps) => {
    this.maybeUpdateBodyState(nextProps);
    this.maybeUpdatePathOpacity(nextProps);
    this.maybeUpdateScale(nextProps);
  }

  /**
   * Updates the body state if time has changed.
   *
   * @param {Object} nextProps
   * @param {Number} nextProps.time - current time, in seconds
   */
  maybeUpdateBodyState = ({time}) => {
    if (this.props.time !== time) {
      this.setBodyState(this.props, this.ellipse);
    }
  }

  /**
   * Updates the path opacity if the list of highlighted orbitals changed.
   *
   * @param {Object} nextProps
   * @param {String[]} nextProps.highlightedOrbitals
   */
  maybeUpdatePathOpacity = ({highlightedOrbitals}) => {
    if (this.props.highlightedOrbitals !== highlightedOrbitals) {
      this.setPathOpacity(this.props, highlightedOrbitals);
    }
  }

  /**
   * Updates items that are privy to scale changes when appropriate.
   * 
   * @param {Object} nextProps
   * @param {Number} nextProps.time - current time, in seconds
   * @param {Number} nextProps.scale - user-defined scale
   */
  maybeUpdateScale = ({time, scale}) => {
    if (scale !== this.props.scale) {
      if (this.props.isSatellite) {
        // only update the orbital path scale for satellites
        this.ellipse.setScale(scale);
      }
      this.setBodyState(this.props, this.ellipse);
      // keep track of last time the scale updated so lines 
      // don't constantly re-render (which is computationally expensive)
      this.setState({
        scaleLastUpdate: time
      });
    }
  }

  /**
   * Sets the visual opacity of the orbital path ellipse.
   * 
   * @param {Object} props - orbital props
   * @param {String[]} highlightedOrbitals
   */
  setPathOpacity = (props, highlightedOrbitals) => {
    this.setState({
      pathOpacity: Service.getPathOpacity(props, highlightedOrbitals)
    });
  }

  /**
   * Sets the visual opacity of the orbital path ellipse.
   * 
   * @param {Object} props - orbital props
   */
  setGroupRotations = (props) => {
    this.setState({
      eclipticGroupRotation: Service.getEclipticGroupRotation(props),
      orbitalGroupRotation: Service.getOrbitalGroupRotation(props)
    });
  }

  /**
   * Sets the visual opacity of the orbital path ellipse.
   * 
   * @param {Object} props - orbital props
   * @param {Ellipse} ellipse - instance of orbital ellipse
   */
  setBodyState = (props, ellipse) => {
    this.setState({
      bodyRotation: Service.getBodyRotation(props),
      bodyPosition: Service.getBodyPosition(props, ellipse),
      bodyRadius: Service.getBodyRadius(props)
    });
  }

  /**
   * Renders a new label, with mouse events bound to it.
   * 
   * @returns {Object3D} label
   */
  getLabel = () => {
    const {action, name, camera, id, isSatellite} = this.props;

    return new Label({
      text: name,
      camera,
      maxDistance: Service.getMaxViewDistance(isSatellite),
      events: {
        click: action.setActiveOrbital.bind(this, id, name),
        mouseover: action.addHighlightedOrbital.bind(this, id),
        mouseout: action.removeHighlightedOrbital.bind(this, id)
      }
    });
  }

  render() {
    return (
      <Orbital
        eclipticGroupRotation={this.state.eclipticGroupRotation}
        orbitalGroupRotation={this.state.orbitalGroupRotation}
        pathVertices={this.ellipse.getVertices()}
        bodyPosition={this.state.bodyPosition}
        bodyRotation={this.state.bodyRotation}
        bodyRadius={this.state.bodyRadius}
        pathOpacity={this.state.pathOpacity}
        atmosphere={this.props.atmosphere}
        scaleLastUpdate={this.state.scaleLastUpdate}
        maps={this.props.maps}
        children={this.props.children}
        label={this.label}
        id={this.props.id}
      />
    );
  }
}

export default OrbitalContainer;