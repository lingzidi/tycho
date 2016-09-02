import Orbital from '../../../../client/engine/objects/orbital';
import Mesh from '../../../../client/engine/props/mesh';
import Ellipse from '../../../../client/engine/props/ellipse';
import Scale from '../../../../client/engine/global/scale';
import Fixtures from './__fixtures__';
import moment from 'moment';
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
        arcRotate: fixture.rotation,
        axialTilt: fixture.axialTilt,
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

      let getDimensions = (plane) => {
        return {
          x: plane.rotation.x || 0,
          z: plane.rotation.z || 0
        }
      };

      let originalRefPlane = orbital.getOrbital(),
          originalOrbPlane = orbital.getOrbitalPlane(),
          originalDimensions = {
            referencePlane: getDimensions(originalRefPlane),
            originalPlane : getDimensions(originalOrbPlane)
          };

      orbital.setPlanarRotations(originalRefPlane, originalOrbPlane, fixture);

      let nextDimensions = {
        referencePlane: getDimensions(originalRefPlane),
        originalPlane : getDimensions(originalOrbPlane)
      };

      ['x', 'z'].forEach(d => {

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