const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'test', // Replace with your MySQL username
    password: 'test12345', // Replace with your MySQL password
    database: 'car_rental'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// PUT endpoint to update vehicle information
app.put('/vehicles/:vehicleID', (req, res) => {
    const vehicleID = req.params.vehicleID;
    const { Brand, Price, Name, Mileage, Seats, Type, IsAvailable } = req.body;

    const sql = `UPDATE vehicle SET brand = ?, price = ?, name = ?, mileage = ?, seats = ?, type = ?, isAvailable = ? WHERE vehicleId = ?`;

    db.query(sql, [Brand, Price, Name, Mileage, Seats, Type, IsAvailable, vehicleID], (err, result) => {
        if (err) {
            console.error('Error updating vehicle:', err);
            return res.status(500).json({error: 'Error updating vehicle'});
        }
        if (result.affectedRows === 0) {
            // No rows were affected, which means the vehicle ID doesn't exist
            return res.status(404).json({message: 'Vehicle not found'});
        }
        res.json({message: 'Vehicle updated successfully'});
    });
});

const port = 8800;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
