/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const sinon = require('sinon');
const Renter = require('../../dst/models/renter');


describe('Renter', () => {
  describe('constructor', () => {
    it('should create a renter', (done) => {
      const r = new Renter({ name: 'r1', money: 20000, complaints: 2 });
      r.validate(err => {
        expect(err).to.be.undefined;
        expect(r.name).to.equal('r1');
        expect(r.money).to.equal(20000);
        expect(r.complaints).to.equal(2);
        done();
      });
    });
    it('should NOT create a renter - missing name', (done) => {
      const r = new Renter({ money: 20000, complaints: 2 });
      r.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a renter - too many complaints', (done) => {
      const r = new Renter({ name: 'r1', money: 20000, complaints: 4 });
      r.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
