const { eventService } = require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const CreateEvent = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const body = req.body;
    const event = await eventService.createEvent(userId, body);
    res.status(200).json(event);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const EventById = catchAsync(async (req, res) => {
  try {
    const event = await eventService.eventById(req.params.eventId);
    res.status(200).json(event);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const QueryEvents = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['eventName', 'eventLocation']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await eventService.queryEvents(filter, options);
    res.send(result);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const GetAllEvents = catchAsync(async (req, res) => {
  try {
    const event = await eventService.allEvents();
    res.status(200).json(event);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const ReportEvent = catchAsync(async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const report = req.body;
    const eventReport = await eventService.reportEvent(userId, eventId, report);
    res.status(200).json(eventReport);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const UpcomingEvents = catchAsync(async (req, res) => {
  try {
    const event = await eventService.upcomingEvents();
    res.status(200).json(event);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const PastEvents = catchAsync(async (req, res) => {
  try {
    const event = await eventService.pastEvents();
    res.status(200).json(event);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});
const EditEvent = catchAsync(async (req ,res) => {
  try{
    const { userId, eventId } = req.params;
    const update = req.body;
   const event = await eventService.editEvent(userId,eventId,update)
   res.status(200).json(event);
  }catch(error){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
})
module.exports = {
  CreateEvent,
  EventById,
  QueryEvents,
  GetAllEvents,
  ReportEvent,
  UpcomingEvents,
  PastEvents,
  EditEvent,
};
