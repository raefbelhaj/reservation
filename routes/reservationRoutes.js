const express = require('express');
const sale = require('../models/salle');
const reservation = require('../models/reservation');
const router = express.Router();

router.get('/create/:id', async (req, res) => {
    try {
        // Ici vous pouvez récupérer des données nécessaires pour le formulaire, par exemple la liste des salles
        const salles = await sale.find({ available: true });

        // Rendre la vue EJS avec les données
        res.render('createReservation', { salles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des données.' });
    }
});


router.post('/create', async (req, res) => {
    try {
        const { salleId, date, startTime, endTime } = req.body;

        // Vérifie si la salle est disponible
        const salle = await sale.findById(salleId);

        if (!salle || salle.available === false) {
            return res.status(400).json({ message: "La salle n'est pas disponible pour la réservation." });
        }
        else if (salle.available){
            // Créer la réservation
            const newReservation = new reservation({ salleId, date, startTime, endTime });
            await newReservation.save();
            // Mettre à jour la disponibilité de la salle
            salle.available = false;
            await salle.save();
            return res.status(201).json({ message: 'Réservation créée avec succès.' });
        } 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation.' });
    }
});

router.post('/updateReservationAvailability', async (req, res) => {
    // Logique pour mettre à jour la disponibilité de la réservation, à implémenter
});

module.exports = router;
