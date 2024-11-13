const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend'))); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '123456', 
    database: 'carwash_service' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return; 
    }
    console.log('Connected to MySQL Database.');
});
app.post('/book', (req, res) => {
    const { name, date, time } = req.body;
    if (!name || !date || !time) {
        return res.status(400).send({ message: 'Please provide name, date, and time.' });
    }
    const checkQuery = 'SELECT * FROM bookings WHERE name = ? AND date = ? AND time = ?';

    db.query(checkQuery, [name, date, time], (err, results) => {
        if (err) {
            console.error('Error executing check query:', err);
            return res.status(500).send({ message: 'Error checking booking.', error: err });
        }
        if (results.length > 0) {
            return res.status(409).send({ message: 'Booking already exists for the specified date and time.' });
        }
        const query = 'INSERT INTO bookings (name, date, time) VALUES (?, ?, ?)';
        db.query(query, [name, date, time], (err, result) => {
            if (err) {
                console.error('Error executing insert query:', err);
                return res.status(500).send({ message: 'Error saving booking.', error: err });
            }
            res.status(200).send({ message: 'Booking successful!', bookingId: result.insertId });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});