const moment = require('moment');

function formatMessage(username, text){
    // returning the object
    return{
        username,
        text,
        time: moment().format('h:mm a') // hour:minutes AM/PM
    }
};

module.exports = formatMessage;