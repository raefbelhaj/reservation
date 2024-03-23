const express = require('express');
const Salle = require('../models/salle');
const router = express.Router();
const { requireAuth } = require('../middelware/authMiddleware'); // Importer le middleware d'authentification


// Render view
// liste salles
router.get('/salles',requireAuth , async (req, res) => {
  try {
    const salles = await Salle.find();
    res.render('salles', { salles }); // Render the 'salles' view
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Afficher le formulaire pour ajouter une salle
router.get('/nouvelle', async (req, res) => {
    try {
      res.render('nouvelleSalle'); // Rend la vue 'nouvelleSalle.ejs'
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  //update salle
  router.get('/update/:id', async (req, res) => {
    try {
      const salle = await Salle.findById(req.params.id);
      if (!salle) {
        return res.status(404).json({ message: 'Salle not found' });
      }
      res.render('updateSalle', { salle }); // Render the 'updateSalle' view with salle data
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // POST route to update a salle
  router.post('/update/:id', async (req, res) => {
    try {
      const { capacity, equipment } = req.body;
      // Convert 'on' string to Boolean for 'available'
      const available = req.body.available === 'on';
      const updatedSalle = await Salle.findByIdAndUpdate(
        req.params.id,
        { capacity, equipment, available },
        { new: true }
      );
      if (!updatedSalle) {
        return res.status(404).json({ message: 'Salle not found' });
      }
      res.status(200).json({ message: 'Salle updated successfully', salle: updatedSalle });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  








// json 
router.get('', async (req, res) => {
  try {
    const salles = await Salle.find();
    res.json(salles);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/addSalle', async (req, res) => {
    try {
      let { capacity, equipment, available } = req.body;
      
      // Convertir 'available' en booléen si nécessaire
      if (available === 'on') {
        available = true;
      } else {
        available = false;
      }
  
      const newSalle = new Salle({ capacity, equipment, available });
      await newSalle.save();
      res.status(201).send('Salle added successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

router.put('/update/:id', async (req, res) => {
  try {
    const { capacity, equipment, available } = req.body;
    await Salle.findByIdAndUpdate(req.params.id, { capacity, equipment, available }, { new: true });
    res.status(201).send('Salle updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Salle.findByIdAndDelete(req.params.id);
    res.status(201).send('Salle deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const salle = await Salle.findById(req.params.id);
    res.json(salle);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
