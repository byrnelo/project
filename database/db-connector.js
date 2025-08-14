// Lorraine Byrne and Suhayl Khan
// CS 340 Summer 2025
// Roll the Dice Database
// Date: 08/14/2025
// Citations:
// Followed complete structure of https://canvas.oregonstate.edu/courses/2007765/assignments/10118865
// No AI used

// Get an instance of mysql we can use in the app
let mysql = require('mysql2')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : 'classmysql.engr.oregonstate.edu',
    user              : '',
    password          : '',
    database          : ''
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
module.exports = pool;