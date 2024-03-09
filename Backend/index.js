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
    "INSERT INTO HasReserved (VehicleID, UserID, StartTime, EndTime) VALUES (1, 1, '2024-03-10 09:00:00', '2024-03-12 17:00:00'), (7, 2, '2024-03-11 11:30:00', '2024-03-14 15:45:00'), (13, 3, '2024-03-15 08:00:00', '2024-03-18 12:00:00'), (4, 4, '2024-03-19 10:15:00', '2024-03-21 14:30:00');",
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

app.post("/create_reservation", function (req, res) {
  console.log([
    req.body.vehicleId,
    req.body.userId,
    req.body.startTime,
    req.body.endTime,
  ]);

  const q =
    "INSERT INTO HasReserved (VehicleID, UserID, StartTime, EndTime) VALUES (?, ?, ?, ?)";

  const values = [
    req.body.vehicleId,
    req.body.userId,
    req.body.startTime,
    req.body.endTime,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    res.redirect("/read_reservations");
  });
});

app.get("/reservations", (req, res) => {
  const query = "SELECT * FROM HasReserved";
  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(data);
  });
});

app.get("/read_reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML/read_reservations.html"));
});

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

app.get("/create_reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML/create_reservations.html"));
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

app.post("/item", function (req, res) {
  console.log([
    req.body.vehicleId,
    req.body.brand,
    req.body.price,
    req.body.name,
    req.body.mileage,
    req.body.seats,
    req.body.type,
    req.body.isAvailable,
  ]);

  const q =
    "INSERT INTO Vehicles (VehicleID, Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.vehicleId,
    req.body.brand,
    req.body.price,
    req.body.name,
    req.body.mileage,
    req.body.images,
    req.body.seats,
    req.body.type,
    req.body.isAvailable,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    res.redirect("/read_vehicles");
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});


// ___________ ADDING DELETE  ___________

//Delete vehicles

function deleteVehiculeById(id, callback) {
  const query = `DELETE FROM Car_Rental.Vehicles WHERE Vehicleid = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
}

app.delete("/Vehicles/:VehicleID", (req, res) => {
  const idToDelete = req.params.VehicleID; 
  deleteVehiculeById(idToDelete, (error, results) => {
    if (error) {
      console.error('Error deleting vehicle by ID:', error);
      res.status(500).send('Internal Server Error'); 
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Vehicle not found'); 
    } else {
      res.status(200).send('Vehicle deleted successfully'); 
    }
  });
});

//Delete users

function deleteUserById(id, callback) {
  const query = `DELETE FROM Car_Rental.Users WHERE Userid = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
}

app.delete("/Users/:UserID", (req, res) => {
  const idToDelete = req.params.UserID; 
  deleteUserById(idToDelete, (error, results) => {
    if (error) {
      console.error('Error deleting user by ID:', error);
      res.status(500).send('Internal Server Error'); 
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('User not found'); 
    } else {
      res.status(200).send('User deleted successfully'); 
    }
  });
});

//Delete reservations (I put the function inside the route handler)

app.delete("/HasReserved/:UserID/:VehicleID", (req, res) => {
  const userIDToDelete = req.params.UserID;
  const vehicleIDToDelete = req.params.VehicleID;
  
  cancelReservation(userIDToDelete, vehicleIDToDelete, (error, results) => {
      if (error) {
          console.error('Error cancelling reservation:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('Reservation not found');
      } else {
          res.status(200).send('Reservation cancelled successfully');
      }
  });
});

// ___________  END OF DELETE ___________


