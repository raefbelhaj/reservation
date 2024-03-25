

const express = require('express');
const Salle = require('../models/salle');
const Reservation = require('../models/reservation');
const router = express.Router();
const nodemailer = require('nodemailer');
const authenticate = require('../middelware/authMiddleware');
const User = require('../models/user'); // Importer le modèle User

// Configurer le transporter Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'raefbelhaj54@gmail.com',
        pass: 'iwda zsna pipy rajf'
    }
});
router.get('/create/:id',authenticate, async (req, res) => {
    try {
        // Ici vous pouvez récupérer des données nécessaires pour le formulaire, par exemple la liste des salles
        const salles = await Salle.find({ available: true });

        // Rendre la vue EJS avec les données
        res.render('createReservation', { salles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des données.' });
    }
});




router.post('/create', authenticate, async (req, res) => {
    try {
        const { salleId, date, startTime, endTime } = req.body;
        const userId = req.user._id; // Récupérer l'ID de l'utilisateur authentifié

        // Vérifier si la salle est disponible
        const salle = await Salle.findById(salleId);
        if (!salle || salle.available === false) {
            return res.status(400).json({ message: "La salle n'est pas disponible pour la réservation." });
        }

        // Créer la réservation
        const newReservation = new Reservation({ salleId, userId, date, startTime, endTime });
        await newReservation.save();

        // Mettre à jour la disponibilité de la salle
        salle.available = false;
        await salle.save();

        // Récupérer l'e-mail de l'utilisateur depuis la base de données
        const user = await User.findById(userId);
        const userEmail = user.email;

        // Envoyer un e-mail de confirmation à l'utilisateur
        const mailOptions = {
            from: 'your_email@example.com',
            to: userEmail,
            subject: 'Confirmation de réservation',
            html: `<p>Votre réservation pour la salle a été confirmée. Date: ${date}, Heure de début: ${startTime}, Heure de fin: ${endTime}</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation:', error);
            } else {
                console.log('E-mail de confirmation envoyé:', info.response);
            }
        });

        res.render('confirmation'); // Afficher une page de confirmation
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création de la réservation.' });
    }
});

module.exports = router;


