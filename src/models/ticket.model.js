//purchaseTickets ? forFriends + amount
//totalTickets
//ticketsLeft
//myTickets ? liveTickets(purchased by friends) + pastTickets
//resellTicket ? soldout(yes or no) + status
//purchase resellTicket ? biddinglist + userdata
//tickettype ? newticket || resold
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoDuplicateKeyError = require('../utils/mongoDuplicateKeyError');

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  ticketTypes: [
    {
      ticketTitle: {
        type: String,
        required: true,
      },
      ticketPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  isResell: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['new', 'resell'],
    default: 'new',
  },
});
ticketSchema.plugin(toJSON);
ticketSchema.plugin(paginate);

mongoDuplicateKeyError(ticketSchema);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
