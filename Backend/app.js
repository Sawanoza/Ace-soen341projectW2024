const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../Database/db.js");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json());

//testing
const http = require('http');
const server = http.createServer(app);

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


app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM Users WHERE Email = ? AND Password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length > 0) {
      const userId = results[0].UserID;
      res.status(200).json({ userId });
    } else {
      res.status(401).send("Invalid email or password");
    }
  });
});

app.post("/create_reservation", function (req, res) {
  console.log([
    req.body.vehicleId,
    req.body.userId,
    req.body.startTime,
    req.body.endTime,
  ]);

  const qInsert =
    "INSERT INTO HasReserved (VehicleID, UserID, StartTime, EndTime) VALUES (?, ?, ?, ?)";
  const valuesInsert = [
    req.body.vehicleId,
    req.body.userId,
    req.body.startTime,
    req.body.endTime,
  ];

  const qUpdate = "UPDATE Vehicles SET isAvailable = 0 WHERE VehicleID = ?";
  const valuesUpdate = [req.body.vehicleId];

  db.query(qInsert, valuesInsert, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    db.query(qUpdate, valuesUpdate, (err, data) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }
      
      console.log("Reservation created successfully. Vehicle availability updated.");
      res.redirect("/read_reservations");
    });
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
  const vehicleID = req.params.vehicleID; 

  db.query('SELECT * FROM Vehicles WHERE VehicleID = ?', [vehicleID], (err, results) => {
      if (err) {
          console.error('Error retrieving vehicle details:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      
      if (results.length === 0) {
          res.status(404).json({ error: 'Vehicle not found' });
          return;
      }

      
      res.json(results[0]);
  });
});

app.get("/agreement", (req, res) => {
  res.sendFile(path.join(__dirname, "public/agreement.html"));
});

app.get("/check_out", (req, res) => {
  res.sendFile(path.join(__dirname, "public/check_out.html"));
});

app.get("/getEmailByUserID/:userID", function (req, res) {
  const userID = req.params.userID; // Get the userID from the route parameter
  
  // Query to fetch the Email based on the provided UserID
  const getEmailQuery = "SELECT Email FROM Users WHERE UserID = ?";
  
  // Execute the query
  db.query(getEmailQuery, [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if a user with the provided UserID exists
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve and send the Email in the response
    const email = result[0].Email;
    res.status(200).json({ email });
  });
});

app.get("/getUserIdByEmail/:email", function (req, res) {
  const email = req.params.email; // Get the email from the route parameter
  
  // Query to fetch the UserID based on the provided email
  const getUserIdQuery = "SELECT UserID FROM Users WHERE Email = ?";
  
  // Execute the query
  db.query(getUserIdQuery, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if a user with the provided email exists
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve and send the UserID in the response
    const userId = result[0].UserID;
    res.status(200).json({ userId });
  });
});

app.post("/create_usertemp", function (req, res) { 
  // Query to fetch the maximum user ID
  const maxUserIdQuery = "SELECT MAX(UserID) AS maxUserId FROM Users";
  
  // Execute the query to get the maximum user ID
  db.query(maxUserIdQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    // Determine the new user ID
    const latestUserId = result[0].maxUserId || 0;
    const newUserId = latestUserId + 1;

    // Insert new user with the generated user ID
    const insertQuery =
      "INSERT INTO Users (UserID, FirstName, LastName, ContactNo, Email, password, Address, IsCust, IsAdmin, IsRep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
    const values = [
      newUserId,
      req.body.firstName,
      req.body.lastName,
      req.body.contactNo,
      req.body.email,
      req.body.password,
      req.body.address,
      req.body.isCust,
      req.body.isAdmin,
      req.body.isRep,
    ];
  
    // Execute the insert query
    db.query(insertQuery, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }

    });
  });
});


// The following get methods are used for admins

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

app.get("/rent_log", (req, res) => {
  res.sendFile(path.join(__dirname, "public/rental_log.html"));
});

app.get("/rental_logs", (req, res) => {
  const q = "SELECT * FROM RentalLog";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
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
    const branchId = 1; 
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
  const getVehicleQuery = 'SELECT * FROM Car_Rental.Vehicles WHERE VehicleID = ?';
  db.query(getVehicleQuery, [vehicleID], (error, vehicleResults) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (vehicleResults.length === 0) {
      callback(new Error('Vehicle not found'), null);
      return;
    }

    const query = 'DELETE FROM Car_Rental.HasReserved WHERE UserID = ? AND VehicleID = ?';
    db.query(query, [userID, vehicleID], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      
      const updateQuery = 'UPDATE Car_Rental.Vehicles SET isAvailable = 1 WHERE VehicleID = ?';
      db.query(updateQuery, [vehicleID], (error, updateResults) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, results);
      });
    });
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


//Check if the script is run directly using Node.js (Fixed interferance with Jest)
if (require.main === module) {
  app.listen(8800, () => {
  console.log("Connected to backend.");
  });
}

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

//________ STRART BRANCHES ________

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

// ________ END BRANCHES ___________

app.get("/getPrice/:VehicleID", (req, res) => {
  const vehicleId = req.params.VehicleID;

  const query = "SELECT Price FROM Vehicles WHERE VehicleID = ?";

  db.query(query, [vehicleId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Return the price
    res.json({ price: data[0].Price });
  });
});

app.get("/fetch/:VehicleID/:UserID", (req, res) => {
  const vehicleId = req.params.VehicleID;
  const userId = req.params.UserID;

  // SQL query to fetch required data by joining Users, Vehicles, and HasReserved tables
  const fetchQuery = `
    SELECT 
      Users.UserID,
      Users.FirstName,
      Users.LastName,
      Users.Address,
      Users.ContactNo,
      Users.Email,
      Vehicles.Brand AS Make,
      Vehicles.Name AS Model,
      Vehicles.Type,
      Vehicles.Price,
      Vehicles.VehicleID,
      HasReserved.StartTime AS RentalStartDate,
      HasReserved.EndTime AS RentalEndDate,
      RentalLog.ReturnDate
    FROM 
      Users
    INNER JOIN HasReserved ON Users.UserID = HasReserved.UserID
    INNER JOIN Vehicles ON HasReserved.VehicleID = Vehicles.VehicleID
    LEFT JOIN RentalLog ON HasReserved.VehicleID = RentalLog.VehicleID AND HasReserved.UserID = RentalLog.UserID
    WHERE 
      HasReserved.VehicleID = ? AND HasReserved.UserID = ?;
  `;

  // Execute the query
  db.query(fetchQuery, [vehicleId, userId], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Prepare the Rental Agreement text
    let rentalAgreement = `This Rental Agreement ("Agreement") is entered into between Ace Agency, located at MTL, Rue De Car Rental, hereinafter referred to as the "Rental Company," and the individual or entity identified below, hereinafter referred to as the "Renter":<br><br>`;

    // Loop through the fetched data
    result.forEach((item) => {
      // Calculate rental period
      const startTime = new Date(item.RentalStartDate);
      const returnDate = new Date(item.ReturnDate || item.RentalEndDate); // Use RentalEndDate if ReturnDate is null
      const differenceInMilliseconds = returnDate - startTime;
      const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      // Append Renter's Information
      rentalAgreement += `<strong>1. Renter's Information:</strong><br>`;
      rentalAgreement += `UserID: ${item.UserID}<br>`;
      rentalAgreement += `Name: ${item.FirstName} ${item.LastName}<br>`;
      rentalAgreement += `Address: ${item.Address}<br>`;
      rentalAgreement += `Contact Number: ${item.ContactNo}<br>`;
      rentalAgreement += `Email Address: ${item.Email}<br><br>`;

      // Append Vehicle Information
      rentalAgreement += `<strong>2. Vehicle Information:</strong><br>`;
      rentalAgreement += `Make: ${item.Make}<br>`;
      rentalAgreement += `Model: ${item.Model}<br>`;
      rentalAgreement += `Type: ${item.Type}<br>`;
      rentalAgreement += `Vehicle Identification Number : ${item.VehicleID}<br><br>`;

      // Append Rental Details
      rentalAgreement += `<strong>3. Rental Details:</strong><br>`;
      rentalAgreement += `Rental Start Date: ${item.RentalStartDate}<br>`;
      rentalAgreement += `Rental End Date: ${
        item.ReturnDate || item.RentalEndDate
      }<br>`;
      rentalAgreement += `Rental Period: ${days} days ${hours} hours<br>`;
      rentalAgreement += `Rental Rate: ${item.Price}$/hr<br>`;
      rentalAgreement += `<pre>
      4. Rental Terms and Conditions:
      The Renter acknowledges receiving the vehicle described above in good condition and agrees to return it to the Rental Company in the same condition, subject to normal wear and tear.
      The Renter agrees to use the vehicle solely for personal or business purposes and not for any illegal activities.
      The Renter agrees to pay the Rental Company the agreed-upon rental rate for the specified rental period. Additional charges may apply for exceeding the mileage limit, late returns, fuel refueling, or other damages.
      The Renter agrees to bear all costs associated with traffic violations, tolls, and parking fines incurred during the rental period.
      The Renter acknowledges that they are responsible for any loss or damage to the vehicle, including theft, vandalism, accidents, or negligence, and agrees to reimburse the Rental Company for all repair or replacement costs.
      The Renter agrees to return the vehicle to the designated drop-off location at the agreed-upon date and time. Failure to do so may result in additional charges.
      The Rental Company reserves the right to terminate this agreement and repossess the vehicle without prior notice if the Renter breaches any terms or conditions of this agreement.
      The Renter acknowledges receiving and reviewing a copy of the vehicle's insurance coverage and agrees to comply with all insurance requirements during the rental period.
      5. Indemnification:
      
      The Renter agrees to indemnify and hold harmless the Rental Company, its employees, agents, and affiliates from any claims, liabilities, damages, or expenses arising out of or related to the Renter's use of the vehicle.
      
      6. Governing Law:
      
      This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising under or related to this Agreement shall be resolved exclusively by the courts of [Jurisdiction].
      
      7. Entire Agreement:
      
      This Agreement constitutes the entire understanding between the parties concerning the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral.
      
      8. Signatures:
      
      The parties hereto have executed this Agreement as of the date first written above. </pre>`;
      rentalAgreement += `<form action="/submitForm" method="POST">
      <h3>Renter:</h3>
      <label for="renter_signature">Signature:</label><br>
      <input type="text" id="renter_signature" name="renter_signature" required><br>
      <label for="renter_print_name">Print Name:</label><br>
      <input type="text" id="renter_print_name" name="renter_print_name" required><br>
      <label for="renter_date">Date:</label><br>
      <input type="text" id="renter_date" name="renter_date" required><br><br>
    
      <h3>Rental Company:</h3>
      <label for="company_signature">Signature:</label><br>
      <input type="text" id="company_signature" name="company_signature" required><br>
      <label for="company_print_name">Print Name:</label><br>
      <input type="text" id="company_print_name" name="company_print_name" required><br>
      <label for="company_date">Date:</label><br>
      <input type="text" id="company_date" name="company_date" required><br><br>
    
      <input type="submit" value="Submit">
    </form>
    `;
    });

    // Send the Rental Agreement text as HTML response
    res.setHeader("Content-Type", "text/html");
    res.send(rentalAgreement);
  });
});

//________ START CHECKOUT__________

app.post("/checkout", (req, res) => {
  const { userId, vehicleId, returnDate, cost } = req.body;

  const insertQuery =
    "INSERT INTO RentalLog (VehicleID, UserID, ReturnDate,RentCost) VALUES (?, ?, ?,?)";
  db.query(
    insertQuery,
    [vehicleId, userId, returnDate, cost],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log("Rental information inserted successfully.");
      res
        .status(200)
        .json({ message: "Rental information inserted successfully." });
    }
  );
});

app.get("/checkout/:vehicleId", (req, res) => {
  const vehicleId = req.params.vehicleId;
  const returnDate = req.query.returnDate;

  const query = "SELECT StartTime FROM HasReserved WHERE VehicleID = ?";

  db.query(query, [vehicleId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Vehicle not found or not reserved" });
    }

    const startTime = new Date(data[0].StartTime);
    const endDate = new Date(returnDate);
    const differenceInMilliseconds = endDate - startTime;
    const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    res.json({
      startTime: startTime,
      returnDate: returnDate,
      days: days,
      hours: hours,
    });
  });
});

//____________ END OF CHECKOUT ___________

app.post('/check_out', (req, res) => {
  console.log("Connected");
  const userId = req.body.userId;
  const vehicleId = req.body.vehicleId;
  const isDamaged = req.body.isDamaged; 
  const damageDetails = req.body.damageDetails;
  const isStolen = req.body.isStolen;
  const email= req.body.email;
  
  const LATE_FEE_PER_HOUR = 25; 
  const DAMAGE_FEE = 100; 

  
  db.query('SELECT * FROM HasReserved WHERE UserID = ? AND VehicleID = ?', [userId, vehicleId], (error, reservations) => {
    if (error) {
      console.error('Database error:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (reservations.length === 0) {
      res.status(404).send('Reservation not found');
      return;
    }

    const reservation = reservations[0];

    
    db.query('DELETE FROM HasReserved WHERE UserID = ? AND VehicleID = ?', [userId, vehicleId], (error, result) => {
      if (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      
      let totalExtraCharges = 0;
      const currentTime = new Date();
      const reservationEndTime = new Date(reservation.EndTime);

      if (currentTime > reservationEndTime) {
        const hoursLate = Math.ceil((currentTime - reservationEndTime) / (1000 * 60 * 60));
        totalExtraCharges += hoursLate * LATE_FEE_PER_HOUR;
      }

      if (isDamaged) {
        totalExtraCharges += DAMAGE_FEE;
      }
     

      res.json({ success: true, message: 'Reservation checked out successfully!', extraCharges: totalExtraCharges });

  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'mustafa.abulh4@gmail.com',
    pass: 'xsrs ajej lsae makx'
    ,
  },
});
const mailOptions = {
  from: 'mustafa.abulh4@gmail.com', 
  to: email, 
  subject: 'Checkout Confirmation', 
  text: `Hello,

Your checkout has been processed successfully.

Details:
- User ID: ${userId}
- Vehicle ID: ${vehicleId}
- Extra Charges: $${totalExtraCharges}
${isDamaged ? `- Damage Details: ${damageDetails}` : '- Damage Details: Perfect Condition'}
${isStolen ? '\n- Note: Vehicle reported stolen.' : ''}

Thank you for using our service.

Best,
Ace Team`
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
    res.json({ success: false, message: 'Email could not be sent.' });
  } else {
    console.log('Email sent: ' + info.response);
    res.json({ success: true, message: 'Reservation checked out successfully!', extraCharges: totalExtraCharges });
  }
});

transporter.verify().then(console.log).catch(console.error);

    });
  });

});
app.post("/confirmed_reservation", function (req, res) {
  console.log([
    req.body.vehicleId,
    req.body.userId,
    req.body.startTime,
    req.body.endTime,
  ]);

  const qInsert =
    "INSERT INTO HasReserved (VehicleID, UserID, StartTime, EndTime) VALUES (?, ?, ?, ?)";
  const valuesInsert = [
    req.body.vehicleId,
    req.body.userId,
    req.body.startTime,
    req.body.endTime,
  ];

  const qUpdate = "UPDATE Vehicles SET isAvailable = 0 WHERE VehicleID = ?";
  const valuesUpdate = [req.body.vehicleId];

  // Query to fetch the price of the vehicle
  const qGetPrice = "SELECT Price FROM Vehicles WHERE VehicleID = ?";
  const valuesGetPrice = [req.body.vehicleId];

  db.query(qInsert, valuesInsert, (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    db.query(qUpdate, valuesUpdate, (err, data) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }

      console.log("Reservation created successfully. Vehicle availability updated.");

      // Fetch the price of the vehicle from the database
      db.query(qGetPrice, valuesGetPrice, (err, priceData) => {
        if (err) {
          console.error(err);
          return res.send(err);
        }

        // Calculate total price and taxes based on fetched vehicle price
        const vehiclePrice = priceData[0].Price; // Accessing the price from the query result
        const { totalPrice, totalTaxAmount } = calculateTotalPrice(vehiclePrice);

        // Insert into RentalLog table
        const qRentalLog =
          "INSERT INTO RentalLog (VehicleID, UserID, ReturnDate, RentCost) VALUES (?, ?, ?, ?)";
        const valuesRentalLog = [
          req.body.vehicleId,
          req.body.userId,
          req.body.endTime,
          totalPrice,
        ];

        db.query(qRentalLog, valuesRentalLog, (err, data) => {
          if (err) {
            console.error("Error inserting into RentalLog:", err);
            return res.status(500).send("Error inserting into RentalLog");
          }

          console.log("Inserted into RentalLog successfully.");

          // Email sending logic
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
              user: 'mustafa.abulh4@gmail.com',
              pass: 'xsrs ajej lsae makx',
            },
          });

          const mailOptions = {
            from: 'mustafa.abulh4@gmail.com',
            to: req.body.email,
            subject: 'Reservation Confirmation',
            text: `Hello,

Your Reservation Details:

- User ID: ${req.body.userId}
- Vehicle ID: ${req.body.vehicleId}
- Start Time: ${req.body.startTime}
- End Time: ${req.body.endTime}
- Total Price: $${totalPrice.toFixed(2)}
- Taxes (GST + QST): $${totalTaxAmount.toFixed(2)}

Thank you for using our service.

Best regards,
Ace Team`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Email could not be sent:', error);
              res.status(500).send('Email could not be sent');
            } else {
              console.log('Email sent:', info.response);
              res.status(200).send('Reservation created successfully and email sent.');
            }
          });
        });
      });
    });
  });
});

function calculateTotalPrice(price) {
  const GST = 0.05;
  const QST = 0.09975;
  const totalTax = GST + QST;
  const totalPrice = price * (1 + totalTax);
  const totalTaxAmount = totalPrice - price;
  return { totalPrice, totalTaxAmount };
}
