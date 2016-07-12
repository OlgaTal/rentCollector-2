/* eslint-disable no-use-before-define, func-names, no-underscore-dangle */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true, validate: { validator: duplicateNameValidator } },
  sqft: { type: Number, required: true, min: 500, max: 2500 },
  rooms: { type: Number, required: true, min: 1, max: 4 },
  rent: { type: Number, required: true, min: 1000 },
  deposit: { type: Number, required: true, min: 50 },
  collectRent: { type: Number, required: true, min: 0 },
  rentDue: { type: Number, required: true },
  lateFee: { type: Number, required: true, min: 10 },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
});

function duplicateNameValidator(name, cb) {
  this.model('Apartment').find({ name }, (err, apartments) => {
    cb(!apartments.length);
  });
}

schema.methods.lease = function (renter, cb) {
  this.renter = renter._id;
  renter.apartment = this._id;
  this.save((err, apartment) => {
    renter.save(() => {
      cb(err, apartment);
    });
  });
};

module.exports = mongoose.model('Apartment', schema);
