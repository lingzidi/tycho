import Orbital from '../../../../client/engine/objects/orbital';
import Mesh from '../../../../client/engine/props/mesh';
import Ellipse from '../../../../client/engine/props/ellipse';
import Fixtures from './__fixtures__';
import THREE from 'three';

describe('Orbital', () => {

  let orbital,
      fixture = Fixtures.Orbital;

  beforeEach(() => {
    orbital = new Orbital(fixture);
  });

  describe('renderGeometries', () => {

    it('should assign a new mesh', () => {

      let mesh = orbital.mesh;

      mesh.should.not.be.null;
      mesh.should.be.instanceOf(Mesh);
      mesh.should.containSubset({
        radius: fixture.radius,
        rotation: fixture.rotation,
        axialTilt: fixture.axialTilt
      });

    });

    it('should assign a new ellipse with axis and eccenticity', () => {

      let ellipse = orbital.ellipse;

      ellipse.should.not.be.null;
      ellipse.should.be.instanceOf(Ellipse);
      ellipse.should.containSubset({
        atmosphereColor: fixture.atmosphereColor,
        semimajor: ellipse.scale(fixture.semimajor),
        semiminor: ellipse.scale(fixture.semiminor)
      });

    });

  });

  describe('getOrbitalPlane', () => {

    it('should return a new Object3D with mesh and ellipse children', () => {

      let plane = orbital.getOrbitalPlane();

      plane.should.be.instanceOf(THREE.Object3D);
      plane.children.length.should.equal(2);
      plane.children[0].should.equal(orbital.ellipse.getObject());
      plane.children[1].should.equal(orbital.mesh.getObject());
    });

  });

  describe('setPlanarRotations', () => {

    it('should augment x and z coords for pivot planes', () => {

      let getXZ = (plane) => {
        return {
          x: plane.x || 0,
          z: plane.z || 0
        }
      };

      let originalRefPlane = orbital.getOrbital(),
          originalOrbPlane = orbital.getOrbitalPlane(),
          originalDimensions = {
        referencePlane: getXZ(originalRefPlane),
        originalPlane : getXZ(originalOrbPlane)
      };

      orbital.setPlanarRotations(originalRefPlane, originalOrbPlane, fixture);

      let nextDimensions = {
        referencePlane: getXZ(originalRefPlane),
        originalPlane : getXZ(originalOrbPlane)
      };

      ['x', 'z'].forEach((d) => {

        originalDimensions
          .referencePlane[d]
          .should.not.equal(nextDimensions.referencePlane[d]);

        originalDimensions
          .originalPlane[d]
          .should.not.equal(nextDimensions.originalPlane[d]);

        nextDimensions.originalPlane[d].should.be.a.number;
        nextDimensions.referencePlane[d].should.be.a.number;

      });

    });

  });


  describe('rotateObject', () => {

    it('should rotate an Object3D by given dimension', () => {

      let testObject = new THREE.Object3D();
          testObject.x = 0;

      let oldX = testObject.x;

      orbital.rotateObject('x', testObject, Math.PI);

      let newX = testObject.x;

      newX.should.not.be.null;
      newX.should.be.a.number;
      newX.should.not.equal(oldX);

    });

  });

  describe('updatePosition', () => {

    it('should set mesh position based on current time in ellipse', () => {

      let time = 1470323035;
      let mesh = orbital.mesh.getObject();
      let vect = orbital.ellipse.getPosition(
        time, fixture.nextPeriapsis, fixture.lastPeriapsis
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