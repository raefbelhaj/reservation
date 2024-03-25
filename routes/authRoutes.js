const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const router = express.Router();


//regiter 
router.get('/register', (req, res) => {
    res.render('register');
  });

router.post('/register',async (req,res)=>{
    try {
    
        const {id,username,email,phone,password}=req.body;
        const user = new User({id,username,email,phone,password});
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//login

router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).send('Utilisateur non trouvé');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).send('Mot de passe invalide');
      }
    
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    
      // Définition du cookie authToken
      res.cookie('authToken', token, { httpOnly: true });
    
      // Redirection vers la page de liste des salles après la connexion
      res.redirect('/salle/salles');
    
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  });
  
  




module.exports = router;
