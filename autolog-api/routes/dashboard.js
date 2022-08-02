const express = require("express");
const Dashboard = require("../models/dashboard");
const security = require("../middleware/security");
const Log = require("../models/log");
const router = express.Router();

// endpoint to create an checklist item
router.post("/checklist", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { user } = res.locals;
        const items = await Dashboard.createChecklist({ item: req.body, user: user });
        return res.status(201).json({ items });
    } catch (err) {
        next(err);
    }
});

// endpoint to get check list item by ID
router.get("/id/:itemId", security.requireAuthenticatedUser, async (req, res, next) => {
        try {
            const { itemId } = req.params;

            const item = await Dashboard.fetchCheckItemById(itemId);

            return res.status(200).json({ item });
        } catch (error) {
            next(error);
        }
    }
);

// endpoint to update checklist item by ID
router.patch("/id/:itemId", security.requireAuthenticatedUser, async (req, res, next) => {
        try {
            const { itemId } = req.params;
            const itemUpdate = await Dashboard.fetchCheckItemById(itemId);
            const updatedItem = await Dashboard.updateCheckItem(itemId, {itemUpdate: req.body});

            return res.status(200).json({ updatedItem });
        } catch (error) {
            next(error);
        }
    }
);

// endpoint to delete checklist item by ID
router.delete("/id/:itemId",security.requireAuthenticatedUser, async (req, res, next) => {
        try {
            const { itemId } = req.params;

            const result = await Dashboard.deleteCheckItem(itemId);

            return res.status(200).json({ result });
        } catch (error) {
            next(error);
        }
    }
);


// endpoint to get items generated by user
router.get("/me", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        //send json response with all of the user-owned checklist item instances in an array
        const { user } = res.locals;
        const inventoryId = req.query.inventoryId;
        const items = await Dashboard.listItemForUser(user);
        const logs = await Log.fetchLogs(inventoryId);
        const announcements = await Dashboard.listAnnouncementForUser(user);
        
        //make /me for announcements
        return res.status(200).json({ items, logs, announcements});
    } catch (err) {
        next(err);
    }
});

// endpoint to create an announcement
router.post("/announcement", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { user } = res.locals;
        const items = await Dashboard.createAnnouncements({ announcement: req.body, user: user });
        return res.status(201).json({ items });
    } catch (err) {
        next(err);
    }
});

// endpoint to get an announcement
router.get("/announcementId/:itemId", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const item = await Dashboard.fetchAnnouncementById(itemId);

        return res.status(200).json({ item });
    } catch (error) {
        next(error);
    }
}
);
// endpoint to update an announcement

router.patch("/announcementId/:itemId", security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const aUpdate = await Dashboard.fetchAnnouncementById(itemId);
        const updatedItem = await Dashboard.updateAnnouncement(itemId, {aUpdate: req.body});

        return res.status(200).json({ updatedItem });
    } catch (error) {
        next(error);
    }
}
);
// endpoint to delete announcement by ID
router.delete("/announcementId/:itemId",security.requireAuthenticatedUser, async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const result = await Dashboard.deleteAnnouncement(itemId);

        return res.status(200).json({ result });
    } catch (error) {
        next(error);
    }
}
);



module.exports = router;
