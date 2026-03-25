const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventories');

// Get all inventories
router.get('/', inventoryController.getAll);

// Get inventory by ID
router.get('/:id', inventoryController.getById);

// Add stock
router.post('/add-stock', inventoryController.addStock);

// Remove stock
router.post('/remove-stock', inventoryController.removeStock);

// Reservation
router.post('/reservation', inventoryController.reservation);

// Sold
router.post('/sold', inventoryController.sold);

module.exports = router;
