import THREE from 'three';
import Constants from 'constants';
import Math2 from 'engine/math2';
import Mesh from '../Utils/Mesh';
import Ellipse from '../Utils/Ellipse';
import Rings from './Rings';
import Orbital from './Orbital';
import Scale from 'engine/scale';
import Fixtures from '../fixtures';
import moment from 'moment';

describe('Orbital', () => {
  const fixture = Fixtures.Orbital;
  let orbital;

  beforeEach(() => {
    orbital = new Orbital(fixture);
  });

  describe('setUp', () => {
    it('should assign a new mesh', () => {
      const mesh = orbital.mesh;
      const arcRotate = fixture.rotation;
      const radius = Scale(fixture.radius);

      mesh.should.not.be.null;
      mesh.should.be.instanceOf(Mesh);
      mesh.should.containSubset({
        arcRotate,
        radius
      });
    });

    it('should assign a new ellipse with scaled axis and eccenticity', () => {
      const ellipse = orbital.ellipse;
      const semimajor = Scale(fixture.semimajor);
      const semiminor = Scale(fixture.semiminor);
      const atmosphereColor = fixture.atmosphereColor;
      
      ellipse.should.not.be.null;
      ellipse.should.be.instanceOf(Ellipse);
      ellipse.should.containSubset({
        atmosphereColor,
        semimajor,
        semiminor
      });
    });
  });

  describe('getOrbitalPlane', () => {
    it('should return a new Object3D with mesh and ellipse children', () => {
      const plane = orbital.getOrbitalPlane();

      plane.should.be.instanceOf(THREE.Object3D);
      plane.children.length.should.equal(2);
      plane.children[0].should.equal(orbital.ellipse);
      plane.children[1].should.equal(orbital.mesh);
    });
  });

  describe('setPlanarRotations', () => {
    it('should augment x and z coords for pivot planes', () => {
      const refPlane = new THREE.Object3D();
      const orbPlane = new THREE.Object3D();

      sinon.spy(orbital, 'rotateObject');

      orbital.setPlanarRotations(orbPlane, refPlane, fixture);

      orbital.rotateObject.should.have.been.called.thrice;
      orbital.rotateObject.should.have.been.calledWith('x', refPlane, fixture.inclination);
      orbital.rotateObject.should.have.been.calledWith('z', refPlane, fixture.longAscNode);
      orbital.rotateObject.should.have.been.calledWith('z', orbPlane, fixture.argPeriapsis);
    });
  });

  describe('rotateObject', () => {
    it('should rotate an Object3D by the given dimension', () => {
      let testObject = new THREE.Object3D();

      ['x', 'y', 'z'].forEach(d => {
        testObject.rotation[d] = 0;
        const oldDim = testObject.rotation[d];

        orbital.rotateObject(d, testObject, Math.PI);

        const newDim = testObject.rotation[d];

        newDim.should.not.be.null;
        newDim.should.be.a('number');
        newDim.should.not.equal(oldDim);
      });
    });
  });

  describe('updatePosition', () => {
    it('should set mesh position based on current time in ellipse', () => {
      const time = moment().unix();
      const vect = orbital.ellipse.getPosition(time, fixture.periapses);
      const {position} = orbital.mesh;

      orbital.updatePosition(time);
      
      position.should.be.an('object');
      position.x.should.be.a('number');
      position.x.should.equal(vect.x);
      position.y.should.be.a('number');
      position.y.should.equal(vect.y);
    });
  });
});
