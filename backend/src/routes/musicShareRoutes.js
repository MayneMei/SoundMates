const express = require("express");
const musicShareController = require("../controllers/musicShareController");

const router = express.Router();

router.post("/share", musicShareController.shareMusic);
router.get("/received", musicShareController.getReceivedShares);
router.get("/received/:id", musicShareController.getSpecificShare);

module.exports = router;
