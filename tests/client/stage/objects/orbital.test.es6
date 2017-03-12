import Orbital from 'scene/objects/orbital';
import Mesh from 'scene/props/mesh';
import Ellipse from 'scene/props/ellipse';
import Scale from 'engine/scale';
import Fixtures from './__fixtures__';
import moment from 'moment';
import THREE from 'three';

describe('Orbital', () => {

  let orbital,
      fixture = Fixtures.Orbital;

  beforeEach(() => {
    orbital = new Orbital(fixture);
  });

  describe('setUp', () => {

    it('should assign a new mesh', () => {

      let mesh = orbital.mesh;

      mesh.should.not.be.null;
      mesh.should.be.instanceOf(Mesh);
      mesh.should.containSubset({
        arcRotate: fixture.rotation,
        radius: Scale(fixture.radius)
      });

    });

    it('should assign a new ellipse with scaled axis and eccenticity', () => {
      let ellipse = orbital.ellipse;

      ellipse.should.not.be.null;
      ellipse.should.be.instanceOf(Ellipse);
      ellipse.should.containSubset({
        atmosphereColor: fixture.atmosphereColor,
        semimajor: Scale(fixture.semimajor),
        semiminor: Scale(fixture.semiminor)
      });
    });

  });

  describe('getOrbitalPlane', () => {

    it('should return a new Object3D with mesh and ellipse children', () => {
      let plane = orbital.getOrbitalPlane();

      plane.should.be.instanceOf(THREE.Object3D);
      plane.children.length.should.equal(2);
      plane.children[0].should.equal(orbital.ellipse);
      plane.children[1].should.equal(orbital.mesh);
    });
  });

  describe('setPlanarRotations', () => {

    it('should augment x and z coords for pivot planes', () => {
      let refPlane = new THREE.Object3D(),
          orbPlane = new THREE.Object3D();

      sinon.spy(orbital, 'rotateObject');

      orbital.setPlanarRotations(orbPlane, refPlane, fixture);

      orbital.rotateObject.should.have.been.called.thrice;
      orbital.rotateObject.should.have.been
        .calledWith('x', refPlane, fixture.inclination);
      orbital.rotateObject.should.have.been
        .calledWith('z', refPlane, fixture.longAscNode);
      orbital.rotateObject.should.have.been
        .calledWith('z', orbPlane, fixture.argPeriapsis);
    });

  });


  describe('rotateObject', () => {

    it('should rotate an Object3D by the given dimension', () => {
      let testObject = new THREE.Object3D();

      ['x', 'y', 'z'].forEach(d => {
        testObject.rotation[d] = 0;
        let oldDim = testObject.rotation[d];

        orbital.rotateObject(d, testObject, Math.PI);

        let newDim = testObject.rotation[d];

        newDim.should.not.be.null;
        newDim.should.be.a.number;
        newDim.should.not.equal(oldDim);
      });
    });

  });

  describe('updatePosition', () => {

    it('should set mesh position based on current time in ellipse', () => {
      let time = moment().unix(),
          mesh = orbital.mesh,
          vect = orbital.ellipse.getPosition(
            time, fixture.periapses
          );

      orbital.updatePosition(time);
      
      mesh.position.should.be.an.object;

      ['x', 'y'].forEach((d) => {
        mesh.position[d].should.be.a.number;
        mesh.position[d].should.equal(vect[d]);
      });
    });

  });

});