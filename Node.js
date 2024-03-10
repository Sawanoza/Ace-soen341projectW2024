const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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

// GET endpoint to retrieve all vehicles
app.get('/vehicles', (req, res) => {
    const sql = 'SELECT * FROM vehicles';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching vehicles:', err);
            return res.status(500).json({error: 'Error fetching vehicles'});
        }
        res.json(result);
    });
});

// GET endpoint to retrieve a single vehicle by ID
app.get('/vehicles/:vehicleId', (req, res) => {
    const { vehicleId } = req.params;
    const sql = 'SELECT * FROM vehicles WHERE vehicleId = ?';
    db.query(sql, [vehicleId], (err, result) => {
        if (err) {
            console.error('Error fetching vehicle:', err);
            return res.status(500).json({error: 'Error fetching vehicle'});
        }
        if (result.length === 0) {
            return res.status(404).json({message: 'Vehicle not found'});
        }
        res.json(result[0]);
    });
});

// POST endpoint to add a new vehicle
app.post('/vehicles', (req, res) => {
    const { Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable } = req.body;
    const sql = 'INSERT INTO vehicles (Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable], (err, result) => {
        if (err) {
            console.error('Error adding vehicle:', err);
            return res.status(500).json({error: 'Error adding vehicle'});
        }
        res.json({message: 'Vehicle added successfully', vehicleId: result.insertId});
    });
});

// PUT  UPDATE VEHICLES
app.put('/vehicles/:vehicleId', (req, res) => {
    const { vehicleId } = req.params;
    const { Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable } = req.body;
    const sql = 'UPDATE vehicles SET Brand = ?, Price = ?, Name = ?, Mileage = ?, Images = ?, Seats = ?, Type = ?, IsAvailable = ? WHERE vehicleId = ?';
    db.query(sql, [Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable, vehicleId], (err, result) => {
        if (err) {
            console.error('Error updating vehicle:', err);
            return res.status(500).json({error: 'Error updating vehicle'});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Vehicle not found'});
        }
        res.json({message: 'Vehicle updated successfully'});
    });
});
// PUT UPDATE USERS
app.put('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, contactNo, email, address, isCust, isAdmin, isRep } = req.body;

    // Ensure all required fields are provided
    if (!firstName || !lastName || !contactNo || !email || !address || isCust === undefined || isAdmin === undefined || isRep === undefined) {
        return res.status(400).json({error: 'Missing required user information'});
    }

    const sql = `
        UPDATE users 
        SET firstName = ?, lastName = ?, contactNo = ?, email = ?, address = ?, isCust = ?, isAdmin = ?, isRep = ? 
        WHERE userId = ?`;

    db.query(sql, [firstName, lastName, contactNo, email, address, isCust, isAdmin, isRep, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({error: 'Error updating user'});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User updated successfully'});
    });
});


const port = 8800;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
