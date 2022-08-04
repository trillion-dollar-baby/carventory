const express = require("express");
const Item = require("../models/item");
const Log = require("../models/log")
const security = require("../middleware/security");
const permissions = require("../middleware/permissions");
const router = express.Router();

// endpoint to get a generic list of items in inventory
// TODO: check user has access to inventory through middleware
router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        // query parameters
        const inventoryId = req.query.inventoryId;
        const {page, search, category} = req.query;
        const { user } = res.locals;

        const items = await Item.listInventoryItems(inventoryId, search, page, category);
        return res.status(200).json({ items });
    } catch (err) {
        next(err);
    }
});

// endpoint to get item by ID
router.get(
    "/id/:itemId",
    security.requireAuthenticatedUser,
    async (req, res, next) => {
        try {
            const { itemId } = req.params;

            const item = await Item.getItemById(itemId);

            return res.status(200).json({ item });
        } catch (error) {
            next(error);
        }
    }
);

// endpoint to update item by ID
router.patch(
    "/id/:itemId",
    security.requireAuthenticatedUser,
    async (req, res, next) => {
        try {
            const { itemId } = req.params;
            const newValues = req.body;
            const item = await Item.getItemById(itemId);

            const updatedItem = await Item.updateItem(itemId, newValues, item);

            return res.status(200).json({ updatedItem });
        } catch (error) {
            next(error);
        }
    }
);

// endpoint to delete item by ID
router.delete(
    "/id/:itemId",
    security.requireAuthenticatedUser,
    async (req, res, next) => {
        try {
            const { itemId } = req.params;

            const result = await Item.deleteItem(itemId);

            return res.status(200).json({ result });
        } catch (error) {
            next(error);
        }
    }
);

// endpoint to create an item
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { user } = res.locals;
        const items = await Item.createItem({ item: req.body, user: user });

        // If the item has successfully been created, then log it
        if (items) {
            // The createLog method requires an inventory ID, an item ID, a user ID, and action
            const action = "Create"
            const log = await Log.createLog(items.inventory_id, items.id, user.id, action)
        }

        return res.status(201).json({ items });
    } catch (err) {
        next(err);
    }
});

// endpoint to get items generated by user
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        //send json response to client with all of the user-owned item instances in an array
        const { user } = res.locals;
        const items = await Item.listItemForUser(user);
        return res.status(200).json({ items });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
