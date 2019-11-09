const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userName: { type: String,max:255},
    Unread: {type: Number},
    Inbox: [{
       Message: {type: String},
       Read: {type: Boolean},
       From:{ type: String,max:255}
    }
    ],
    Sent: [
        {
            Message: {type: String},
            To:{ type: String,max:255}
        }
    ]
});

module.exports = mongoose.model('Message',messageSchema);