const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const mongoDuplicateKeyError = require('../utils/mongoDuplicateKeyError');

const resaleTicketSchema = new mongoose.Schema({
  ticketUuid: {
    type: String,
    ref: 'Ticket',
    unique: true,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  reason: { type: String, required: true },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // ... other fields like bidding history, expiry time for bidding, etc ...
});

resaleTicketSchema.plugin(toJSON);
resaleTicketSchema.plugin(paginate);

mongoDuplicateKeyError(resaleTicketSchema);

const ResaleTicket = mongoose.model('ResaleTicket', resaleTicketSchema);

module.exports = ResaleTicket;
