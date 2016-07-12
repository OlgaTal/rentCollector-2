/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */
const expect = require('chai').expect;
const sinon = require('sinon');
const Apartment = require('../../dst/models/apartment');
const Renter = require('../../dst/models/renter');

describe('apartment', () => {
  beforeEach(() => {
    sinon.stub(Apartment, 'find').yields(null, []);
  });
  afterEach(() => {
    Apartment.find.restore();
  });
  describe('constructor', () => {
    it('should create an apartment', (done) => {
      const a = new Apartment({ name: 'a1',
        sqft: 2000, rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.undefined;
        expect(a.name).to.equal('a1');
        expect(a.deposit).to.equal(200);
        expect(a.collectRent).to.equal(0);
        done();
      });
    });
    it('should NOT create an apartment: name is missing', done => {
      const a = new Apartment({
        sqft: 2000, rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create a dog object - duplicate dog found in DB', done => {
      Apartment.find.yields(null, [{ name: 'a1' }]);
      const a = new Apartment({ name: 'a1',
        sqft: 2100, rooms: 1, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Apartment.find, { name: 'a1' });
        done();
      });
    });
    it('should NOT create an apartment: sqft is missing', done => {
      const a = new Apartment({ name: 'a1',
        rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create an apartment: sqft is too small', done => {
      const a = new Apartment({ name: 'a1',
        sqft: 100, rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create an apartment: sqft is too large', done => {
      const a = new Apartment({ name: 'a1',
        sqft: 20000, rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create an apartment: number of rooms is missing', done => {
      const a = new Apartment({ name: 'a1',
        sqft: 2000, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create an apartment: number of rooms is too small', done => {
      const a = new Apartment({ name: 'a1',
        sqft: 100, rooms: -1, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create an apartment: number of rooms is too large', done => {
      const a = new Apartment({ name: 'a1',
        sqft: 20000, rooms: 20, rent: 1000, deposit: 200,
        collectRent: 0, rentDue: 5, lateFee: 25 });
      a.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });

  describe('#lease', () => {
    it('should lease an apartment', sinon.test(function (done) {
      const a = new Apartment({ name: 'a1',
        sqft: 2000, rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5, lateFee: 25 });
      const r = new Renter({ name: 'r1', money: 20000, complaints: 2 });
      this.stub(a, 'save').yields(null, { _id: a._id, name: 'a1',
          sqft: 2000, rooms: 2, rent: 1000, deposit: 200, collectRent: 0, rentDue: 5,
          lateFee: 25, renter: r._id });
      this.stub(r, 'save').yields(null, {});
      a.lease(r, (err, apt) => {
        expect(err).to.be.null;
        expect(apt).to.be.ok;
        expect(apt.renter).to.equal(r._id);
        expect(apt._id).to.equal(r.apartment);
        done();
      });
    }));
  });
});
