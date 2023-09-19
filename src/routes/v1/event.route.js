const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const eventController = require("../../controllers/event.controller");

const router = express.Router();

router.post('/create_event/userId/:userId', eventController.postEvent);


module.exports = router;
