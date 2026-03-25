const inventoryModel = require('../schemas/inventories');

const inventoryController = {
    getAll: async (req, res) => {
        try {
            const inventories = await inventoryModel.find().populate('product');
            res.status(200).json(inventories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const inventory = await inventoryModel.findById(req.params.id).populate('product');
            if (!inventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addStock: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            const inventory = await inventoryModel.findOneAndUpdate(
                { product: product },
                { $inc: { stock: quantity } },
                { new: true, upsert: true }
            );
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    removeStock: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            const inventory = await inventoryModel.findOneAndUpdate(
                { product: product, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true }
            );
            if (!inventory) {
                return res.status(400).json({ message: 'Not enough stock or product not found' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    reservation: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            const inventory = await inventoryModel.findOneAndUpdate(
                { product: product, stock: { $gte: quantity } },
                { 
                    $inc: { 
                        stock: -quantity,
                        reserved: quantity
                    } 
                },
                { new: true }
            );
            if (!inventory) {
                return res.status(400).json({ message: 'Not enough stock or product not found' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    sold: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            const inventory = await inventoryModel.findOneAndUpdate(
                { product: product, reserved: { $gte: quantity } },
                { 
                    $inc: { 
                        reserved: -quantity,
                        soldCount: quantity
                    } 
                },
                { new: true }
            );
            if (!inventory) {
                return res.status(400).json({ message: 'Not enough reserved items or product not found' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = inventoryController;
