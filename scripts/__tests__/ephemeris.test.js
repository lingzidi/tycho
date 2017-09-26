const moment = require('moment');
const et = require('expect-telnet');
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
      expect(unix).to.equal(106455798936000000);
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
    // expect(result).to.deep.equal(dataFixture);
  });

  describe('renderSequence()', () => {
    let result;

    beforeEach(() => {
      result = ephemeris.renderSequence([
        'a', 'b', 'c'
      ]);
    });

    it('should return an array', () => {
      expect(result).to.be.an('array');
    });

    it('should have `expect` and `send` properties for each sequence item', () => {
      expect(result).to.be.an('array');

      result.forEach((res) => {
        expect(res).to.be.an('object');
        expect(res).to.have.property('expect');
        expect(res).to.have.property('send');
      })
    });
  });

  describe('nextOrder()', () => {
    it('should return `m` if the passed revolution order is `h`', () => {
      const result = ephemeris.nextOrder('h');

      expect(result).to.not.be.undefined;
      expect(result).to.be.a('string');
      expect(result).to.equal('m');
    });

    it('should return `undefined` if the current order is `m`', () => {
      const result = ephemeris.nextOrder('m');

      expect(result).to.be.undefined;
    });

    it('should return `undefined` if the current order doesn\'t match any presets', () => {
      const result = ephemeris.nextOrder('x');

      expect(result).to.be.undefined;
    });
  });

  describe('momentDateOrder()', () => {
    it('should return the given parameter if not `mo`', () => {
      expect(ephemeris.momentDateOrder('d')).to.equal('d');
    });

    it('should return `month` if the given parameter is `mo`', () => {
      expect(ephemeris.momentDateOrder('mo')).to.equal('month');
    });
  });

  describe('renderDates()', () => {
    const date = moment(1234567890);
    const order = 'd';
    let result;

    beforeEach(() => {
      result = ephemeris.renderDates(order, date);
    });

    it('should be an array with three items', () => {
      expect(result).to.be.an('array');
      expect(result).to.have.length(3);
    });

    it('should return the start date from the given date in the given format', () => {
      const expected = date.format(ephemeris.DATE_FORMAT);

      expect(result[0]).to.be.a('string');
      expect(result[0]).to.equal(expected);
    });

    it('should return the end date 500 days from the given date in the given format', () => {
      const expected = date.add(500, order).format(ephemeris.DATE_FORMAT);

      expect(result[1]).to.be.a('string');
      expect(result[1]).to.equal(expected);
    });

    it('should set the last item to be a step with the given revolutionOrder unit', () => {
      expect(result[2]).to.be.a('string');
      expect(result[2]).to.equal('1d');
    });
  });

  describe('shouldLookupAgain()', () => {
    it('should return false when the revolution order is minutes', () => {
      expect(ephemeris.shouldLookupAgain('m')).to.equal(false);
    });

    it('should return true when the revolution order is not minutes', () => {
      expect(ephemeris.shouldLookupAgain('d')).to.equal(true);
    });
  });
});
