const users = [];

// We can keep everythings saved to database but in this project app we are storing it into memory

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);
    return user;
}

// Get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    // Remove user when he leaves from users array
    // for each user => user.id === id (passed in id)
    const index = users.findIndex(user => user.id === id);
    // findIndex return index if found or else it return -1
    if(index != -1){
        return users.splice(index, 1)[0]; // [0] returns only user otherwise whole array if not []
    }
}

// get room users
function getRoomUsers(room) {
    // filter for each user user.room is strictly equal to room passed
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };