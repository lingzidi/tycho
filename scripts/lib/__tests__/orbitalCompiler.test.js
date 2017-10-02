const orbitalCompiler = require('../orbitalCompiler');
const fixture = require('./__fixtures__/orbital.json');

describe('Orbital Compiler', () => {
  describe('getKeyFromPath()', () => {
    it('should return the file name without the json extension', () => {
      const result = orbitalCompiler.getKeyFromPath('./path/to/file.json');

      expect(result).to.be.a('string');
      expect(result).to.equal('file');
    });
  });

  describe('removeSatellites()', () => {
    let result;

    beforeEach(() => {
      result = orbitalCompiler.removeSatellites({saturn: {}, io: {}}, ['io']);
    });

    it('should remove the property \'io\'', () => {
      expect(result).to.be.an('object');
      expect(result).to.not.have.property('io');
    });

    it('should keep the property \'saturn\'', () => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('saturn');
    });
  });

  describe('mapSatellitesToParents()', () => {
    let result;

    beforeEach(() => {
      result = orbitalCompiler.mapSatellitesToParents(fixture);
    });

    it('should map the `child` satellite into the `satellites` property', () => {
      expect(result.dummy).to.have.property('satellites');
      expect(result.dummy.satellites).to.be.an('array');
      expect(result.dummy.satellites[0]).to.have.property('id');
      expect(result.dummy.satellites[0]).to.be.an('object');
      expect(result.dummy.satellites[0].id).to.equal('child');
    });
  });
  
  describe('orbitalsToArray()', () => {
    it('should flatten the data into an array', () => {
      const result = orbitalCompiler.orbitalsToArray(fixture);

      expect(result).to.be.an('array');
      expect(result).to.have.length(2);

      result.forEach((orbital) => {
        expect(orbital).to.be.an('object');
        expect(orbital).to.have.property('id');
      });
    });
  });
});
