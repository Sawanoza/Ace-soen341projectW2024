const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../Database/db.js");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

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

app.get('/AdminPage', (req, res) => {
  res.sendFile(path.join(__dirname, "public/AdminPage.html"));
});


app.get("/read_reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "public/read_reservations.html"));
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

app.get('/vehicles/:vehicleID', (req, res) => {
  const vehicleID = req.params.vehicleID; // Retrieve the vehicle ID from the URL parameters

  // Query the database to get vehicle details based on the ID
  db.query('SELECT * FROM Vehicles WHERE VehicleID = ?', [vehicleID], (err, results) => {
      if (err) {
          console.error('Error retrieving vehicle details:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      // If no results are found, return a 404 error
      if (results.length === 0) {
          res.status(404).json({ error: 'Vehicle not found' });
          return;
      }

      // If vehicle details are found, return them as JSON
      res.json(results[0]);
  });
});

app.get("/create_vehicles", (req, res) => {
  res.sendFile(path.join(__dirname, "public/create_vehicles.html"));
});

app.get("/create_reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "public/create_reservations.html"));
});

app.get("/create_users", (req, res) => {
  res.sendFile(path.join(__dirname, "public/create_users.html"));
});

app.get("/read_vehicles", (req, res) => {
  res.sendFile(path.join(__dirname, "public/read_vehicles.html"));
});

app.get("/read_users", (req, res) => {
  res.sendFile(path.join(__dirname, "public/read_users.html"));
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
    "INSERT INTO Vehicles (VehicleID, Brand, Price, Name, Mileage, Seats, Type, IsAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  
  const values = [
    req.body.vehicleId,
    req.body.brand,
    req.body.price,
    req.body.name,
    req.body.mileage,
    req.body.seats,
    req.body.type,
    req.body.isAvailable,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    
    // After inserting the vehicle into the Vehicles table, assign it to branch 1 by default
    const assignToBranchQuery = "INSERT INTO BranchVehicles (BranchID, VehicleID) VALUES (?, ?)";
    const branchId = 1; // Assuming branch 1 is the default branch
    const vehicleId = req.body.vehicleId;
    
    db.query(assignToBranchQuery, [branchId, vehicleId], (assignErr, assignData) => {
      if (assignErr) {
        console.error("Error assigning vehicle to branch:", assignErr);
        return res.send(assignErr);
      }
      res.redirect("/read_vehicles");
    });
  });
});


// ___________ ADDING DELETE  ___________

//Delete vehicles
function deleteVehicleById(id, callback) {
  const deleteBranchVehiclesQuery = `DELETE FROM BranchVehicles WHERE VehicleID = ?`;
  const deleteVehicleQuery = `DELETE FROM Vehicles WHERE VehicleID = ?`;

  // First, delete corresponding rows from BranchVehicles table
  db.query(deleteBranchVehiclesQuery, [id], (error, result) => {
    if (error) {
      callback(error, null);
      return;
    }

    // Then, delete the vehicle from the Vehicles table
    db.query(deleteVehicleQuery, [id], (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, result);
    });
  });
}

// Route to handle DELETE requests for deleting a vehicle by ID
app.delete("/Vehicles/:VehicleID", (req, res) => {
  const idToDelete = req.params.VehicleID;
  deleteVehicleById(idToDelete, (error, results) => {
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

// Function to delete a user by ID from the database
function deleteUserByIdWithAssociatedRecords(id, callback) {
  const deleteHasReservedQuery = `DELETE FROM HasReserved WHERE UserID = ?`;
  const deleteUserQuery = `DELETE FROM Users WHERE UserID = ?`;

  db.query(deleteHasReservedQuery, [id], (error, result) => {
    if (error) {
      callback(error, null);
      return;
    }
    db.query(deleteUserQuery, [id], (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, result);
    });
  });
}

// Route to handle DELETE requests for deleting a user by ID
app.delete("/Users/:UserID", (req, res) => {
  const idToDelete = req.params.UserID;
  deleteUserByIdWithAssociatedRecords(idToDelete, (error, results) => {
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

function cancelReservation(userID, vehicleID, callback) {
  const query = 'DELETE FROM Car_Rental.HasReserved WHERE UserID = ? AND VehicleID = ?';
  db.query(query, [userID, vehicleID], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
}

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


app.listen(8800, () => {
  console.log("Connected to backend.");
});

module.exports = app;

//____________ UPDATE ______________

// Function to update a vehicle by ID in the database
function updateVehicleById(id, newData, callback) {
  const query = `UPDATE Car_Rental.Vehicles SET ? WHERE VehicleID = ?`;
  db.query(query, [newData, id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
}

// Route to handle PUT requests for updating a vehicle by ID
app.put("/Vehicles/:VehicleID", (req, res) => {
  const idToUpdate = req.params.VehicleID;
  const newData = req.body; 
  updateVehicleById(idToUpdate, newData, (error, results) => {
    if (error) {
      console.error('Error updating vehicle by ID:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Vehicle not found');
    } else {
      res.status(200).send('Vehicle updated successfully');
    }
  });
});

//FOR USERS (update)

// Function to update a user
function updateUserById(id, newData, callback) {
  const query = `UPDATE Car_Rental.Users SET ? WHERE UserID = ?`;
  db.query(query, [newData, id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
}


app.put("/Users/:UserID", (req, res) => {
  const idToUpdate = req.params.UserID;
  const newData = req.body; 
  updateUserById(idToUpdate, newData, (error, results) => {
    if (error) {
      console.error('Error updating user by ID:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});

//_______ END OF UPDATE _________

//_______ START SEARCH ___________

// Branch Search
app.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  if (!isNaN(searchTerm)) {
    const query = `SELECT * FROM Branch WHERE id = ${searchTerm}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error searching for branch by ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results); 
    });
  } else {
    const query = `SELECT * FROM Branch WHERE location LIKE '${searchTerm}%'`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error searching for branch by location:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results); 
    });
  }
});

// Vehicles search
app.get('/search/vehicles', (req, res) => {
  const searchTerm = req.query.term;

  if (!isNaN(searchTerm)) {
    // If the search term is a number, search by VehicleID
    const query = `SELECT * FROM Vehicles WHERE VehicleID = ${searchTerm}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error searching for vehicle by ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results); 
    });
  } else {
    // If the search term is not a number, search by Brand, Name, or Type
    const query = `
      SELECT * FROM Vehicles 
      WHERE Brand LIKE '%${searchTerm}%' 
      OR Name LIKE '%${searchTerm}%' 
      OR Type LIKE '%${searchTerm}%'
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error searching for vehicles by brand, name, or type:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results); 
    });
  }
});


// _______ END OF SEARCH _________

// Route to fetch all branches
app.get("/branches", (req, res) => {
  const q = "SELECT * FROM Branch";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Route to fetch branch details by ID along with associated vehicles
app.get("/branches/:branchId", (req, res) => {
  const branchId = req.params.branchId;
  const branchQuery = "SELECT * FROM Branch WHERE id = ?";
  const vehiclesQuery = "SELECT * FROM Vehicles INNER JOIN BranchVehicles ON Vehicles.VehicleID = BranchVehicles.VehicleID WHERE BranchVehicles.BranchID = ?";
  
  db.query(branchQuery, [branchId], (err, branchData) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (branchData.length === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }

    db.query(vehiclesQuery, [branchId], (err, vehiclesData) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const branchDetails = branchData[0];
      branchDetails.vehicles = vehiclesData; 
      res.json(branchDetails);
    });
  });
});

// Route to get branch details by ID
app.get("/branches/details/:branchId", (req, res) => {
  const branchId = req.params.branchId;
  const branchQuery = "SELECT * FROM Branch WHERE id = ?";
  
  db.query(branchQuery, [branchId], (err, branchData) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
      }
      if (branchData.length === 0) {
          return res.status(404).json({ error: "Branch not found" });
      }
      
      const branchDetails = branchData[0];
      res.json(branchDetails);
  });
});

// Route to create a new branch
app.post("/branches", function (req, res) {
  const q =
    "INSERT INTO Branch (id, name, location) VALUES (?, ?, ?)";
  const values = [
    req.body.branchId,
    req.body.name,
    req.body.location
  ];
  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    res.redirect("/branches");
  });
});

// Route to fetch all vehicles assigned to a specific branch
app.get("/branches/:branchId/vehicles", (req, res) => {
  const branchId = req.params.branchId;
  const q = "SELECT * FROM BranchVehicles WHERE BranchID = ?";
  db.query(q, [branchId], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Route to assign a vehicle to a branch
app.post("/branches/:branchId/vehicles", function (req, res) {
  const q =
    "INSERT INTO BranchVehicles (BranchID, VehicleID) VALUES (?, ?)";
  const values = [
    req.params.branchId,
    req.body.vehicleId
  ];
  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    res.redirect(`/branches/${req.params.branchId}/vehicles`);
  });
});


// Route to delete a vehicle assignment from a branch
app.delete("/branches/:branchId/vehicles/:vehicleId", (req, res) => {
  const branchId = req.params.branchId;
  const vehicleId = req.params.vehicleId;
  const q = "DELETE FROM BranchVehicles WHERE BranchID = ? AND VehicleID = ?";
  db.query(q, [branchId, vehicleId], (error, results) => {
    if (error) {
      console.error('Error deleting vehicle assignment:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('Vehicle assignment not found');
    } else {
      res.status(200).send('Vehicle assignment deleted successfully');
    }
  });
});


// Route to get the branch based on the vehicle ID
app.get("/vehicles/:vehicleId/branch", (req, res) => {
  const vehicleId = req.params.vehicleId;
  const q = "SELECT BranchID FROM BranchVehicles WHERE VehicleID = ?";
  db.query(q, [vehicleId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Vehicle not found in any branch" });
    }
    const branchId = data[0].BranchID;
    return res.json({ BranchID: branchId });
  });
});


