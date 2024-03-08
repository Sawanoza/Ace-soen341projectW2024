const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "",
});

app.use(express.static(path.join(__dirname, "HTML")));
app.use(express.urlencoded({ extended: true }));

function createTables() {
  const create_tables = [
    "CREATE DATABASE IF NOT EXISTS Car_Rental;",
    "USE Car_Rental;",
    "CREATE TABLE IF NOT EXISTS Users (UserID INTEGER(9) PRIMARY KEY, ProfileImg VARCHAR(255), FirstName VARCHAR(255), LastName VARCHAR(255), ContactNo INTEGER(10), Email VARCHAR(255), Password VARCHAR(255), Address VARCHAR(255), IsCust BOOLEAN, IsAdmin BOOLEAN, IsRep BOOLEAN);",
    "CREATE TABLE IF NOT EXISTS Vehicles (VehicleID INTEGER(9) PRIMARY KEY, Brand VARCHAR(255), Price INTEGER(9), Name VARCHAR(255), Mileage INTEGER(3), Images VARCHAR(2560), Seats INTEGER(1), Type VARCHAR(255), IsAvailable BOOLEAN);",
    "CREATE TABLE IF NOT EXISTS HasReserved (VehicleID INTEGER(9) PRIMARY KEY, UserID INTEGER(9), FOREIGN KEY (UserID) REFERENCES Users(UserID), StartTime DATETIME, EndTime DATETIME);",
  ];

  create_tables.forEach((query) => {
    db.query(query, function (error, result) {
      if (error) {
        console.log("Error executing query:", error.sqlMessage); // Log the SQL error message
        console.log("Query:", query); // Log the query causing the error
        return;
      }
      console.log(result);
    });
  });
}

app.get("/users", (req, res) => {
  const q = "SELECT * FROM Users";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
});

// Function to insert initial data
function insertData() {
  const insert_values = [
    "INSERT INTO Vehicles (VehicleID, Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable) VALUES (1, 'Toyota', 25, 'Corolla', 30, NULL, 5, 'sedan', true), (2, 'Honda', 35, 'Civic', 32, NULL, 5, 'sedan', true), (3, 'Ford', 30, 'Fusion', 28, NULL, 5, 'sedan', true),  (4, 'Hyundai', 28, 'Elantra', 31, NULL, 5, 'sedan', true), (5, 'Kia', 27, 'Optima', 29, NULL, 5, 'sedan', true), (6, 'Chevrolet', 40, 'Malibu', 27, NULL, 5, 'sedan', true),    (7, 'Toyota', 40, 'RAV4', 25, NULL, 5, 'suv', true), (8, 'Honda', 45, 'CR-V', 24, NULL, 5, 'suv', true), (9, 'Ford', 38, 'Escape', 26, NULL, 5, 'suv', true),  (10, 'Hyundai', 36, 'Tucson', 28, NULL, 5, 'suv', true), (11, 'Kia', 32, 'Sportage', 27, NULL, 5, 'suv', true),  (12, 'Chevrolet', 42, 'Equinox', 26, NULL, 5, 'suv', true),   (13, 'Toyota', 50, 'Highlander', 23, NULL, 7, 'suv', true),   (14, 'Honda', 48, 'Pilot', 22, NULL, 7, 'suv', true),  (15, 'Ford', 52, 'Explorer', 21, NULL, 7, 'suv', true);",
    "INSERT INTO Users (UserID, ProfileImg, FirstName, LastName, ContactNo, Email, Password, Address, IsCust, IsAdmin, IsRep) VALUES (1, NULL, 'John', 'Doe', 1234567890, 'john@example.com', 'password123', '123 Main St', true, NULL, NULL),(2, NULL, 'Jane', 'Smith', 234567890, 'jane@example.com', 'password456', '456 Elm St', true, NULL, NULL),(3, NULL, 'Michael', 'Johnson', 346789012, 'michael@example.com', 'password789', '789 Oak St', true, NULL, NULL),(4, NULL, 'Emily', 'Brown', 456890123, 'emily@example.com', 'passwordabc', '456 Pine St', true, NULL, NULL),(5, NULL, 'Daniel', 'Martinez', 567801234, 'daniel@example.com', 'passworddef', '789 Maple St', true, NULL, NULL),(6, NULL, 'Sarah', 'Taylor', 678912345, 'sarah@example.com', 'passwordghi', '123 Cedar St', true, NULL, NULL),(7, NULL, 'Christopher', 'Anderson', 789013456, 'chris@example.com', 'passwordjkl', '456 Birch St', true, NULL, NULL),(8, NULL, 'Jessica', 'Wilson', 890234567, 'jessica@example.com', 'passwordmno', '789 Walnut St', true, NULL, NULL);",
  ];

  insert_values.forEach((query) => {
    db.query(query, function (error, result) {
      if (error) {
        console.log("Error executing query:", error.sqlMessage); // Log the SQL error message
        console.log("Query:", query); // Log the query causing the error
        return;
      }
      console.log(result);
    });
  });
}

db.connect(function (err) {
  if (err) throw err;
  console.log("connected");
  //dropDatabase()
  createTables();
  insertData();
});

app.get("/", (req, res) => {
  res.json("Connected.");
});

app.get("/vehicles", (req, res) => {
  const q = "SELECT * FROM Vehicles";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/create_vehicles", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML/create_vehicles.html"));
});

app.get("/create_users", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML/create_users.html"));
});

app.get("/read_vehicles", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML/read_vehicles.html"));
});

app.get("/read_users", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML/read_users.html"));
});

app.post("/create_user", function (req, res) {
  console.log([
    req.body.userId,
    req.body.firstName,
    req.body.lastName,
    req.body.contactNo,
    req.body.email,
    req.body.address,
    req.body.isCust,
    req.body.isAdmin,
    req.body.isRep,
  ]);

  const q =
    "INSERT INTO Users (UserID, FirstName, LastName, ContactNo, Email, Address, IsCust, IsAdmin, IsRep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.userId,
    req.body.firstName,
    req.body.lastName,
    req.body.contactNo,
    req.body.email,
    req.body.address,
    req.body.isCust,
    req.body.isAdmin,
    req.body.isRep,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    res.redirect("/read_users");
  });
});


app.post('/update_vehicle', function (req, res) {
    const { vehicleId, brand, price, name, mileage, seats, type, isAvailable } = req.body;

    const q = `
        UPDATE Vehicles 
        SET Brand = ?, Price = ?, Name = ?, Mileage = ?, Seats = ?, Type = ?, IsAvailable = ? 
        WHERE VehicleID = ?`;

    const values = [brand, price, name, mileage, seats, type, isAvailable, vehicleId];

    db.query(q, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating vehicle information');
        }
        res.redirect('/read_vehicles'); // Or respond with success message
    });
});
app.get('/Update_vehicle', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML/Update_vehicle.html'));
});

document.getElementById('updateVehicleForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // Create a FormData object, passing in the form
    var formData = new FormData(this);

    // Use fetch() to send the form data to the server endpoint
    fetch('/update_vehicle', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if(response.ok) {
            return response.json(); // or handle redirect, show success message, etc.
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log(data); // Process success response
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});

