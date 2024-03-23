const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    salleId: { type: mongoose.Schema.Types.ObjectId, ref: 'salle' },
    date: Date,
    startTime: Date,
    endTime: Date
});

const reservation = mongoose.model('Reservation', reservationSchema);
module.exports = reservation;
