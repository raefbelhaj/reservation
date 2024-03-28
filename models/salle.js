const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({

    capacity: Number,
    equipment: String,
    available: { type: Boolean, default: true },
});

const Salle = mongoose.model('Salle', salleSchema); // Définir le modèle Salle
module.exports = Salle;
