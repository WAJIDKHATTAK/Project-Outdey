const express = require('express');
// const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const eventController = require('../../controllers/event.controller');

const router = express.Router();

router.post('/create_event/userId/:userId', eventController.CreateEvent);
router.get('/get_event_by_id/eventId/:eventId', eventController.EventById);
router.get('/query_events',eventController.QueryEvents);
router.get('/get_all_events', eventController.GetAllEvents);
router.post('/report_event/userId/:userId/eventId/:eventId',eventController.ReportEvent);
router.get('/upcoming_events',eventController.UpcomingEvents);
router.get('/past_events',eventController.PastEvents);
router.put('/edit_event/userId/:userId/eventId/:eventId',eventController.EditEvent)

module.exports = router;
