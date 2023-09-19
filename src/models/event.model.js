const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
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
        ticketTitle: {
          type: String,
        },
        ticketPrice: {
          type: Number,
        },
      },
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
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      comment: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'finished'],
      default: 'upcoming', // optional, if you want a default value
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
