import React from 'react';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import OrbitalContainer from './containers/OrbitalContainer';
import data from './global/fixtures';
import Controls from './components/Scene/Utils/Controls';
import Clock from './engine/clock';
import LabelGroup from './components/LabelGroup/LabelGroup';

class App extends React.Component {

  componentWillMount = () => {
    this.cameraPosition = new THREE.Vector3(300, 300, 300);
    this.clock = new Clock();
    this.state = {
      positions: {},
      time: this.clock.getTime()
    };
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
      <OrbitalContainer
        {...orbital}
        time={this.state.time}
        camera={this.refs.camera}
        onUpdate={this.updateScreenPositions}
        odd={odd}
        key={orbital.id}>
        {orbital.children && this.getOrbitalElements(orbital.children, !odd)}
      </OrbitalContainer>
    ));
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
        <LabelGroup
          positions={this.state.positions}
          orbitals={data}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
