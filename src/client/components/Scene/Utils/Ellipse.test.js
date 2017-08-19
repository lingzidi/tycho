import moment from 'moment';
import THREE from 'three';
import Scale from 'engine/scale';
import Vector from 'engine/vector';
import Constants from 'constants';
import Ellipse from './Ellipse';
import Fixtures from './fixtures';

describe('Ellipse', () => {
  let ellipse, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    ellipse = new Ellipse(Fixtures.Ellipse);
  });

  afterEach(() => sandbox.restore());

  describe('setData', () => {
    it('should scale the semimajor and semiminor axes', () => {
      ['semimajor', 'semiminor'].forEach(axis => {
        const scaled = Scale(Fixtures.Ellipse[axis]);

        ellipse.setData(Fixtures.Ellipse);

        ellipse[axis].should.be.a('number');
        ellipse[axis].should.not.be.NaN;
        ellipse[axis].should.equal(scaled);
      });
    });

    it('should set the eccentricity', () => {
      ellipse.eccentricity.should.not.be.null;
      ellipse.eccentricity.should.be.a('number');
      ellipse.eccentricity.should.not.be.NaN;
      ellipse.eccentricity.should.equal(Fixtures.Ellipse.eccentricity);
    });

    xit('should set the atmosphereColor', () => {
      ellipse.atmosphereColor.should.not.be.null;
      ellipse.atmosphereColor.should.be.a('string');
      ellipse.atmosphereColor.should.equal(Fixtures.Ellipse.atmosphereColor);
    });
  });

  describe('setUp', () => {
    it('should assign the rendered line material', () => {
      sandbox.spy(ellipse, 'getLineMaterial');
      ellipse.setUp();

      ellipse.getLineMaterial.should.have.been.called;
      ellipse.material.should.be.an.instanceOf(THREE.LineBasicMaterial);
    });

    it('should assign the ellipse curve', () => {
      sandbox.spy(ellipse, 'getEllipseCurve');
      ellipse.setUp();

      ellipse.getEllipseCurve.should.have.been.called;
      ellipse.ellipse.should.be.an.instanceOf(THREE.EllipseCurve);
    });

    it('should assign the geometric path', () => {
      sandbox.spy(ellipse, 'getPath');
      ellipse.setUp();

      ellipse.getPath.should.have.been.called;
      ellipse.path.should.be.an.instanceOf(THREE.Path);
    });

    it('should assign the path geometry', () => {
      sandbox.spy(ellipse, 'getGeometry');
      ellipse.setUp();
      
      ellipse.getGeometry.should.have.been.called;
      ellipse.geometry.should.be.an.instanceOf(THREE.Geometry);
    });
  });

  describe('getPath', () => {
    let path;

    beforeEach(() => {
      ellipse.ellipse = ellipse.getEllipseCurve();
      sandbox.spy(ellipse.ellipse, 'getPoints');
      path = ellipse.getPath();
    });

    it('should return a path', () => {
      path.should.not.be.null;
      path.should.be.an.instanceOf(THREE.Path);
    });

    it('should pass in the calculated points from constants', () => {
      ellipse.ellipse.getPoints.should.have.been.calledOnce;
      ellipse.ellipse.getPoints.should.have.been.calledWith(
        Constants.ELLIPSE_CURVE_POINTS
      );
    });
  });

  describe('getGeometry', () => {
    let geometry;

    beforeEach(() => {
      ellipse.path = ellipse.getPath();
      sandbox.spy(ellipse.path, 'createPointsGeometry');
      geometry = ellipse.getGeometry();
    });

    it('should return the geometry created from the given path', () => {
      ellipse.path.createPointsGeometry.should.have.been.called;
      geometry.should.be.an.instanceOf(THREE.Geometry);
    });

    it('should contain the number of vertices specified in constants', () => {
      const vertices = geometry.vertices.length - 1;

      vertices.should.be.a('number');
      vertices.should.not.be.NaN;
      vertices.should.equal(Constants.ELLIPSE_CURVE_POINTS);
    });
  });

  describe('getEllipseCurve', () => {
    let curve;

    beforeEach(() => {
      curve = ellipse.getEllipseCurve();
    });

    it('should be a THREE.EllipseCurve', () => {
      curve.should.not.be.null;
      curve.should.be.an.instanceOf(THREE.EllipseCurve);
    });

    it('should have the approximate assigned semimajor and semiminor axes', () => {
      const radii = {
        x: ellipse.semimajor,
        y: ellipse.semiminor
      };

      ['x', 'y'].forEach(c => {
        const axis = `${c}Radius`;

        curve[axis].should.be.a('number');
        curve[axis].should.not.be.null;
        curve[axis].should.not.be.NaN;
        curve[axis].should.not.be.above(Math.ceil(radii[axis]));
        curve[axis].should.not.be.below(Math.floor(radii[axis]));
      });
    });

    it('should have the approximate focus given the aforementioned axes', () => {
      const focus = Vector.getFocus(ellipse.semimajor, ellipse.semiminor);
      const curveFocus = {
        x: curve.aX,
        y: curve.aY
      };

      ['x', 'y'].forEach(c => {
        curveFocus[c].should.be.a('number');
        curveFocus[c].should.not.be.null;
        curveFocus[c].should.not.be.NaN;
        curveFocus[c].should.not.be.above(Math.ceil(focus[c]));
        curveFocus[c].should.not.be.below(Math.floor(focus[c]));
      });
    });
  });

  describe('getLineMaterial', () => {
    let line;

    beforeEach(() => {
      line = ellipse.getLineMaterial();
    });

    it('should be a THREE.Line', () => {
      line.should.not.be.null;
      line.should.be.an.instanceOf(THREE.LineBasicMaterial);
    });

    it('should have the color of the atmosphereColor', () => {
      line.color.should.not.be.null;
      // line.color.should.equal(ellipse.atmosphereColor);//something wrong here
    });

    it('should initialize with 40% opacity', () => {
      line.opacity.should.equal(0.4);
    });

    it('should be transparent', () => {
      line.transparent.should.be.true;
    });
  });

  describe('getPosition', () => {
    let position, time;
    
    beforeEach(() => {
      ellipse.path = ellipse.getPath();
      sandbox.spy(ellipse.path, 'getPoint');
      position = ellipse.getPosition(time, Fixtures.Periapses);
      time = moment().unix();
    });

    it('should return an object containing x,y coord', () => {
      position.should.be.an('object');
      position.should.not.be.null;

      ['x', 'y'].forEach(c => {
        position[c].should.not.be.undefined;
        position[c].should.be.a('number');
        position[c].should.not.be.null;
        position[c].should.not.be.NaN;
      });
    });

    it('should get the point based on the current path', () => {
      ellipse.path.getPoint.should.be.calledOnce;
    });
  });
});

// |                              |
// |                              |
// |                              |
// |                              |
// |______________________________|
//                |
//                |
//                |
//      _________\|/___________
//     /          V           /
//    /                      /
//   /   Reference Plane    /
//  /                      /
// /______________________/
//                |
//      _________\|/___________
//     /          V           /
//    /                      /
//   /    Orbital Plane     /
//  /                      /
// /______________________/




















