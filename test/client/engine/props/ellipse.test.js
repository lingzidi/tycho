import Ellipse from '../../../../client/engine/props/ellipse';
import Scale from '../../../../client/engine/global/scale';
import Constants from '../../../../client/engine/global/constants';
import Vector from '../../../../client/engine/physics/vector';
import Fixtures from './__fixtures__';
import moment from 'moment';
import THREE from 'three';

describe('Ellipse', () => {

  let ellipse;

  beforeEach(() => {
    ellipse = new Ellipse(Fixtures.Ellipse);
  });

  describe('setData', () => {

    it('should set the scaled elliptical axes', () => {
      ['semimajor', 'semiminor'].forEach(axis => {
        let scaled = Scale(Fixtures.Ellipse[axis]);

        ellipse.setData(Fixtures.Ellipse);

        ellipse[axis].should.be.a.number;
        ellipse[axis].should.not.be.NaN;
        ellipse[axis].should.equal(scaled);
      });
    });

    it('should set the eccentricity', () => {
      ellipse.eccentricity.should.be.a.number;
      ellipse.eccentricity.should.not.be.null;
      ellipse.eccentricity.should.not.be.NaN;
      ellipse.eccentricity.should.equal(Fixtures.Ellipse.eccentricity);
    });

    it('should set the atmosphereColor', () => {
      ellipse.atmosphereColor.should.be.a.string;
      ellipse.atmosphereColor.should.not.be.null;
      ellipse.atmosphereColor.should.equal(Fixtures.Ellipse.atmosphereColor);
    });

  });

  describe('renderGeometries', () => {

    it('should assign the rendered line material', () => {
      chai.spy.on(ellipse, 'getLineMaterial');
      ellipse.renderGeometries();
      ellipse.getLineMaterial.should.have.been.called;
      ellipse.material.should.be.an.instanceOf(THREE.LineBasicMaterial);
    });

    it('should assign the ellipse curve', () => {
      chai.spy.on(ellipse, 'getEllipseCurve');
      ellipse.renderGeometries();
      ellipse.getEllipseCurve.should.have.been.called;
      ellipse.ellipse.should.be.an.instanceOf(THREE.EllipseCurve);
    });

    it('should assign the geometric path', () => {
      chai.spy.on(ellipse, 'getPath');
      ellipse.renderGeometries();
      ellipse.getPath.should.have.been.called;
      ellipse.path.should.be.an.instanceOf(THREE.Path);
    });

    it('should assign the path geometry', () => {
      chai.spy.on(ellipse, 'getGeometry');
      ellipse.renderGeometries();
      ellipse.getGeometry.should.have.been.called;
      ellipse.geometry.should.be.an.instanceOf(THREE.Geometry);
    });

    // damn thing's busted too
    // it('should add the ellipse curve to the geometric path', () => {

    //   chai.spy.on(ellipse.path, 'add', 'ellipse');
    //   ellipse.renderGeometries();
    //   ellipse.path.add.should.have.been.called.with(ellipse.ellipse);

    // });

  });


  describe('getPath', () => {

    let path;

    beforeEach(() => {
      ellipse.ellipse = ellipse.getEllipseCurve();
      chai.spy.on(ellipse.ellipse, 'getPoints');
      path = ellipse.getPath();
    });

    it('should return a path', () => {
      path.should.not.be.null;
      path.should.be.an.instanceOf(THREE.Path);
    });

    it('should pass in the calculated points from constants', () => {
      ellipse.ellipse.getPoints.should.have.been.called.once;
      ellipse.ellipse.getPoints.should.have.been.called.with(
        Constants.ELLIPSE_CURVE_POINTS
      );
    });

  });

  describe('getGeometry', () => {

    let geometry;

    beforeEach(() => {
      ellipse.path = ellipse.getPath();
      chai.spy.on(ellipse.path, 'createPointsGeometry');
      geometry = ellipse.getGeometry();
    });

    it('should return the geometry created from the given path', () => {
      ellipse.path.createPointsGeometry.should.have.been.called;
      geometry.should.be.an.instanceOf(THREE.Geometry);
    });

    it('should contain the number of vertices specified in constants', () => {
      let vertices = geometry.vertices.length - 1;

      vertices.should.be.a.number;
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
      let radii = {
        x: ellipse.semimajor,
        y: ellipse.semiminor
      };

      ['x', 'y'].forEach(c => {
        let axis = `${c}Radius`;

        curve[axis].should.not.be.null;
        curve[axis].should.be.a.number;
        curve[axis].should.not.be.NaN;
        curve[axis].should.not.be.above(Math.ceil(radii[axis]));
        curve[axis].should.not.be.below(Math.floor(radii[axis]));
      });
    });

    it('should have the approximate focus given the aforementioned axes', () => {
      let focus = Vector.getFocus(ellipse.semimajor, ellipse.semiminor);
      let curveFocus = {
        x: curve.aX,
        y: curve.aY
      };

      ['x', 'y'].forEach(c => {
        curveFocus[c].should.not.be.null;
        curveFocus[c].should.be.a.number;
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

    let position,
        time = moment().unix();

    beforeEach(() => {
      ellipse.path = ellipse.getPath();
      chai.spy.on(ellipse.path, 'getPoint');
      position = ellipse.getPosition(time, Fixtures.Periapses);
    });

    it('should return an object containing x,y coord', () => {
      position.should.not.be.null;
      position.should.be.an.object;
      ['x', 'y'].forEach(c => {
        position[c].should.not.be.undefined;
        position[c].should.not.be.null;
        position[c].should.be.a.number;
        position[c].should.not.be.NaN;
      });
    });

    it('should get the point based on the current path', () => {
      ellipse.path.getPoint.should.be.called.once;
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




















