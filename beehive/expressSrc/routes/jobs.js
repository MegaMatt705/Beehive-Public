const express = require('express');
const router = express.Router();
const Job = require('../database/schemas/jobSchema');

router.get('/', async (req, res) => {
    try {
      const jobs = await Job.find();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.post('/create', async (req, res) => {
    try {
      const { title, description, location } = req.body;
  
      let job = new Job({
        title,
        description,
        location
      });
  
      job = await job.save();
      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;