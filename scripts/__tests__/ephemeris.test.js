const ephemeris = require('../ephemeris');
const setsFixture = require('./__fixtures__/sets.json');
const listFixture = require('./__fixtures__/list.json');
const rawFixture = require('./__fixtures__/rawFixture.json');
const dataFixture = require('./__fixtures__/dataFixture.json');

describe('Ephemeris Parser', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => sandbox.restore());

  describe('getNumberVar()', () => {
    it('should return the separated string as a trimmed key/value pair', () => {
      const key = 'key';
      const value = 1234;
      const result = ephemeris.getNumberVar(`${key} = ${value}`);

      expect(result).to.be.an('object');
      expect(result).to.have.property(key);
      expect(result.key).to.equal(value);
    });
  });

  describe('julianToUnix()', () => {
    it('should return a UNIX timestamp for the given Julian calendar day', () => {
      const julian = 1234567890;
      const unix = ephemeris.julianToUnix(julian);

      expect(unix).to.be.a('number');
      expect(unix).to.equal(106455798936000);
    });
  });

  describe('getPeriapses()', () => {
    let result;

    beforeEach(() => {
      result = ephemeris.getPeriapses(listFixture);
    });

    it('should return an object with the last and next params', () => {
      expect(result).to.be.an('object');
      expect(result).to.have.property('last');
      expect(result).to.have.property('next');
    });
  });

  describe('mapToDataSets()', () => {
    let result;
    let ephemerisParams = [
      'EC', 'QR', 'IN', 'OM', 'W', 'Tp', 
      'N', 'MA', 'TA', 'A', 'AD', 'PR'
    ];

    beforeEach(() => {
      result = ephemeris.mapToDataSets(setsFixture);
    });

    it('should be an array with length of the input sets', () => {
      expect(result).to.be.an('array');
      expect(result).to.have.length(setsFixture.length);
    });

    it('should return each object with the NASA-designated orbital params', () => {
      result.forEach((res) => {
        expect(res).to.be.an('object');
        
        ephemerisParams.forEach((param) => {
          expect(res).to.have.property(param);
          expect(res[param]).to.be.a('number');
        });
      });
    });
  });

  describe('getSemiminorAxis()', () => {
    it('should calculate the semiminor axis for the given eccentricity and semimajor', () => {
      const result = ephemeris.getSemiminorAxis(0.05, 123456);

      expect(result).to.be.a('number');
      expect(result).to.equal(123301.58342924879);
    });
  });

  describe('getTychoData()', () => {
    it('should have all Tycho-format properties', () => {
      const props = [
        'argPeriapsis', 'eccentricity',
        'longAscNode', 'semiminor',
        'semimajor', 'periapses'
      ];
      const result = ephemeris.getTychoData(setsFixture);

      props.forEach((prop) => {
        expect(result).to.have.property(prop);
      });
    });
  });

  describe('getDataFromRaw()', () => {
    const result = ephemeris.getDataFromRaw(rawFixture);

    expect(result).to.be.an('object');
    expect(result).to.deep.equal(dataFixture);
  });
});
