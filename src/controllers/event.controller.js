const { eventService } = require('../services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const postEvent = catchAsync(async (req, res) => {
  try {
    const userId = req.params.userId;
    const body = req.body;
    const event = eventService.createEvent(userId, body);
    res.status(200).json(event);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
});

module.exports = {
  postEvent,
};
