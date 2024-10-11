const express = require('express');
const { House } = require('../model');
const router = express.Router();

const { authMiddleware } = require('../middleware');

router.get('/', authMiddleware, async (req, res) => {
  const { page, pageSize } = req.query;
  const houses = await House.findAll({
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(page, 10) - 1) * (pageSize || 10) || 0,
    order: [['id', 'ASC']],
  });
  const total = await House.count();
  res.json({
    list: houses,
    total,
  });
});
router.get('/:id', async (req, res) => {
  const house = await House.findByPk(req.params.id);
  res.json(house);
});
router.post('/', async (req, res) => {
  const house = await House.create(req.body);
  res.json(house);
});
router.put('/:id', async (req, res) => {
  const house = await House.findByPk(req.params.id);
  if (house) {
    await house.update(req.body);
    res.json(house);
  } else {
    res.status(404).json({ message: 'House not found' });
  }
});
router.delete('/:id', async (req, res) => {
  const house = await House.findByPk(req.params.id);
  if (house) {
    await house.destroy();
    res.json({ message: 'House deleted' });
  } else {
    res.status(404).json({ message: 'House not found' });
  }
});

module.exports = router;
