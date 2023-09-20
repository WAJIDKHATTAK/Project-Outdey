//getAllEvent
//getEventById
//createEvent
//reportEvent
//eventStatus
//upcomingEvents show only 4 or 5
//PastEvents
//EditEvents
//savedEvents (event reminder)
//queryEvents
//eventPhotos
//eventsNearMe
//eventreminder ? friends attendingevents [give reminder for those]
const httpStatus = require('http-status');
const { Event } = require('../models');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const moment = require('moment')

const pageNumber = 1; // replace with current page number
const pageSize = 5; // number of items per page
const skip = (pageNumber - 1) * pageSize;

const createEvent = async (userId, body) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
    }
    const eventDetails = {
      user: userId,
      ...body,
    };
    return await Event.create(eventDetails);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const eventById = async (eventId) => {
  try {
    const event = await Event.findOne({ _id: eventId });
    return event;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
/**
 * Query for events
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEvents = async (filter, options) => {
  try {
    const newFilter = {};

    // Handle eventName
    if (filter.eventName) {
      newFilter.eventName = filter.eventName;
    }

    // Handle eventLocation
    if (filter.eventLocation) {
      newFilter['eventLocation.Name'] = filter.eventLocation;
    }

    if (filter.latitude && filter.longitude) {
      const radiusInKm = 100;
      const earthRadiusInKm = 6371;
      const radiusInRadians = radiusInKm / earthRadiusInKm;

      newFilter['eventLocation.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(filter.longitude), parseFloat(filter.latitude)],
            radiusInRadians
          ],
        },
      };
    }

    const event = await Event.paginate(newFilter,options);
    return event;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const allEvents = async () => {
try{
  const event = await Event.find({}).skip(skip).limit(pageSize).lean();
  return event;
}catch(error){
  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
}
};
const reportEvent = async (userId, eventId, body) => {
  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
    }
    if (!event) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Event Not Found');
    }
    const report = {
      userId,
      comment: body.comment, // Assuming body contains a comment field
    };
    event.report = report;
    await event.save();
    return event;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const eventStatus = async (eventId) => {
  //tell wether it's in the past present or future
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Event not found');
    }

    const currentTime = new Date();
    const eventDate = new Date(event.eventDate + 'T' + event.eventStartTime);
    const eventEndTime = new Date(event.eventDate + 'T' + event.eventEndTime);

    if (currentTime < eventDate) {
      event.status = 'upcoming';
    } else if (currentTime >= eventDate && currentTime <= eventEndTime) {
      event.status = 'ongoing';
    } else {
      event.status = 'finished';
    }

    await event.save();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const upcomingEvents = async () => {
  try {
    const currentDate = moment().format('YYYY-MM-DD');

    const upcomingEvents = await Event.find({
      eventDate : {
        $gte: currentDate,
      }
    })
      .skip(skip)
      .limit(pageSize)
      .sort({ eventDate: -1 })
      .lean();
    return upcomingEvents;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const pastEvents = async () => {
  try {
    const currentDate = moment().format('YYYY-MM-DD');

    const upcomingEvents = await Event.find({
      eventDate: {
        $lt: currentDate,
      },
    })
      .skip(skip)
      .limit(pageSize)
      .sort({ eventDate: 1 })
      .lean();
    return upcomingEvents;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const editEvent = async (userId, eventId, body) => {
  try {
    const event = await Event.findOne({ _id: eventId});
   const user = await Event.find({ user: userId})
    if (!event) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Event not found');
    }
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Not Authorized');
    }
    await Event.updateOne({ _id: eventId, user: userId }, { $set: body });
    const updatedEvent = await Event.findOne({ _id: eventId, user: userId });
    return updatedEvent;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
module.exports = {
  createEvent,
  eventById,
  queryEvents,
  allEvents,
  reportEvent,
  eventStatus,
  upcomingEvents,
  pastEvents,
  editEvent,
};
//In case TimeZones Matter Date.now returns current timezone of the server location
//could handle it like this
//const axios = require('axios');
//const moment = require('moment-timezone');
//  const coordinates = event.eventLocation.coordinates;  // assuming [longitude, latitude]
// const apiKey = 'YOUR_GOOGLE_API_KEY';  // replace with your Google API key

// // Step 1: Get time zone from Google Time Zone API
// const response = await axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${coordinates[1]},${coordinates[0]}&timestamp=${Math.floor(Date.now() / 1000)}&key=${apiKey}`);

// const timeZoneId = response.data.timeZoneId;

// // Step 2: Get current time in that time zone
// const currentTime = moment.tz(timeZoneId);

// const eventDate = moment.tz(`${event.eventDate} ${event.eventStartTime}`, timeZoneId);
// const eventEndTime = moment.tz(`${event.eventDate} ${event.eventEndTime}`, timeZoneId);

// // Step 3: Compare times to set event status
// if (currentTime.isBefore(eventDate)) {
//   event.status = 'upcoming';
// } else if (currentTime.isBetween(eventDate, eventEndTime)) {
//   event.status = 'ongoing';
// } else {
//   event.status = 'finished';
// }
