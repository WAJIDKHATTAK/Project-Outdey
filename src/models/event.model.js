const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoDuplicateKeyError = require('../utils/mongoDuplicateKeyError');
const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventStartTime: {
      type: String,
      required: true,
    },
    eventEndTime: {
      type: String,
      required: true,
    },
    TicketType: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    }
   ],
    description: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    eventPhotos: [
      {
        type: String,
      },
    ],
    eventLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: true, // This line specifies that the `type` subfield is required
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
        required: true, // This line specifies that the `coordinates` subfield is required
      },
      Name: {
        type: String,
        required: true, // This line specifies that the `Name` subfield is required
      },
    },
    report: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      comment: { type: String},
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'finished'],
      default: 'upcoming', // optional, if you want a default value
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);

mongoDuplicateKeyError(eventSchema);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

//Will have to update service and controllers for this since no need to check date in service
// // Static method to update event statuses
// EventSchema.statics.updateEventStatus = async function () {
//   console.log('Updating event statuses...');

//   // Fetch current date and time
//   const currentDate = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
//   const currentTime = new Date().toTimeString().slice(0, 5); // "HH:mm"

//   // Update statuses based on your specific conditions
//   await this.updateMany(
//     { eventDate: { $gt: currentDate } },
//     { status: 'upcoming' }
//   );

//   await this.updateMany(
//     { eventDate: currentDate, eventStartTime: { $lte: currentTime }, eventEndTime: { $gte: currentTime } },
//     { status: 'ongoing' }
//   );

//   await this.updateMany(
//     { eventDate: { $lt: currentDate } },
//     { status: 'finished' }
//   );

//   // Log completion
//   console.log('Statuses updated.');
// };

// const Event = mongoose.model('Event', EventSchema);

// // Schedule a cron job to run once a day at midnight
// cron.schedule('0 0 * * *', async () => {
//   console.log('Running a task every day at midnight');

//   try {
//     await Event.updateEventStatus();
//   } catch (error) {
//     console.error('Failed to update event statuses:', error);
//   }
// });
