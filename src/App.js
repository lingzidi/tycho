import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import Orbital from './components/Scene/Objects/Orbital';
import data from './global/fixtures';
import Controls from './components/Scene/Utils/Controls';
import Clock from './engine/clock';
import Label from './components/Label/Label';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(300, 300, 300);
    this.state = {positions: {}};
    this.clock = new Clock();
    this.clock.speed(4);
  }

  componentDidMount = () => {
    this.controls = new Controls(this.refs.camera);
  }

  componentWillUnmount = () => {
    this.controls.dispose();
    delete this.controls;
  }

  _onAnimate = () => {
    if (this.clock) {
      this.setState({
        time: this.clock.getTime()
      });
    }
  }

  updateScreenPositions = (position, id) => {
    this.setState({
      positions: Object.assign(this.state.positions, {
        [id]: position
      })
    });
  }

  getOrbitalElements = (orbitals, odd) => {
    return orbitals.map((orbital) => (
      <Orbital {...orbital}
        time={this.state.time}
        camera={this.refs.camera}
        onUpdate={this.updateScreenPositions}
        odd={odd}
        key={orbital.id}>
        {orbital.children && this.getOrbitalElements(orbital.children, !odd)}
      </Orbital>
    ));
  }

  getOrbitalLabels = (orbitals) => {
    let labels = [];

    orbitals.forEach((orbital) => {
      labels.push(
        <Label
          position={this.state.positions[orbital.id]}
          orbital={orbital}
          key={orbital.id}>
          {orbital.children && this.getOrbitalLabels(orbital.children)}
        </Label>
      );

      if (orbital.children) {
        labels = labels.concat(this.getOrbitalLabels(orbital.children));
      }
    });
    return labels;
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (
      <div>
        <React3
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={width}
          height={height}
          antialias={true}
          onAnimate={this._onAnimate}
          alpha={true}>
          <scene>
            <perspectiveCamera
              name="camera"
              ref="camera"
              fov={50}
              aspect={width / height}
              near={1}
              far={10000}
              position={this.cameraPosition}
            />
            {this.getOrbitalElements(data)}
            <axisHelper size={500} />
          </scene>
        </React3>
        {this.getOrbitalLabels(data)}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
