const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'db/database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("Checking DB at: " + dbPath);

db.all("SELECT * FROM schedules WHERE source LIKE 'Surakarta%' AND destination LIKE 'Jakarta%'", (err, rows) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Found " + rows.length + " matching schedules:");
        if (rows.length > 0) {
            console.log("First row example:", rows[0]);
            console.log("Departure Time:", rows[0].departureTime);
        }
    }
    db.close();
});
