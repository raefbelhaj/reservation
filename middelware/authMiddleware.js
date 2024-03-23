const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    // Vérifier si req.cookies est défini
    if (!req.cookies) {
        res.status(401).send('Les cookies ne sont pas activés.');
        return;
    }

    const token = req.cookies.authToken;

    // Vérifier si le token est présent
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // Si le token est invalide, rediriger vers la page de connexion
                res.redirect('/auth/login');
            } else {
                // Si le token est valide, passer à l'étape suivante
                next();
            }
        });
    } else {
        // Si aucun token n'est présent, rediriger vers la page de connexion
        res.redirect('/auth/login');
    }
};

module.exports = { requireAuth };
