const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../Database/db.js");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get("/create_vehicles", (req, res) => {
  res.sendFile(path.join(__dirname, "public/create_vehicles.html"));
});

app.get("/check_out", (req, res) => {
  res.sendFile(path.join(__dirname, "public/check_out.html"));
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

app.get("/agreement", (req, res) => {
  res.sendFile(path.join(__dirname, "public/agreement.html"));
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
      console.error("Error deleting vehicle by ID:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("Vehicle not found");
    } else {
      res.status(200).send("Vehicle deleted successfully");
    }
  });
});

//Delete users

// Function to delete a user by ID from the database

// Important note, when a user is deleted by ID from "Users", the associated records in "HasReserved" should be deleted

function deleteUserByIdWithAssociatedRecords(id, callback) {
  const deleteHasReservedQuery = `DELETE FROM Car_Rental.HasReserved WHERE UserID = ?`;
  const deleteUserQuery = `DELETE FROM Car_Rental.Users WHERE UserID = ?`;

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

app.delete("/Users/:UserID", (req, res) => {
  const idToDelete = req.params.UserID;
  deleteUserByIdWithAssociatedRecords(idToDelete, (error, results) => {
    if (error) {
      console.error("Error deleting user by ID:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  });
});

//Delete reservations (I put the function inside the route handler)

function cancelReservation(userID, vehicleID, callback) {
  const query =
    "DELETE FROM Car_Rental.HasReserved WHERE UserID = ? AND VehicleID = ?";
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
      console.error("Error cancelling reservation:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("Reservation not found");
    } else {
      res.status(200).send("Reservation cancelled successfully");
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
      console.error("Error updating vehicle by ID:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("Vehicle not found");
    } else {
      res.status(200).send("Vehicle updated successfully");
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
      console.error("Error updating user by ID:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated successfully");
    }
  });
});

//_______ END OF UPDATE _________

// ROUTES : //
app.post("/checkout", (req, res) => {
  const { userId, vehicleId, returnDate, cost } = req.body;

  // Perform insertion into RentalLog table
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

    // Assuming you have the startTime and returnDate fetched from the database
    const startTime = new Date(data[0].StartTime);
    const endDate = new Date(returnDate);
    const differenceInMilliseconds = endDate - startTime;
    const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    // Respond with the calculated values
    res.json({
      startTime: startTime,
      returnDate: returnDate,
      days: days,
      hours: hours,
    });
  });
});

// New route to fetch price from Vehicles table
app.get("/getPrice/:vehicleId", (req, res) => {
  const vehicleId = req.params.vehicleId;

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

// Assuming you have already set up your Express app and connected to the database
// Route to handle fetching data
app.get("/fetch/:vehicleId/:userId", (req, res) => {
  const vehicleId = req.params.vehicleId;
  const userId = req.params.userId;

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
