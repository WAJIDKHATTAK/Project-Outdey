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

const ticketSchema = new mongoose.Schema({});
ticketSchema.plugin(toJSON);
ticketSchema.plugin(paginate);

mongoDuplicateKeyError(ticketSchema);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
