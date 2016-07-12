import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true, minlength: 2 },
  money: { type: Number, required: true, min: 1000 },
  complaints: { type: Number, required: true, min: 0, max: 3 },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
});

module.exports = mongoose.model('Renter', schema);
