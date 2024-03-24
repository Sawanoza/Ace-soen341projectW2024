const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../Database/db.js");
const app = express();
const nodemailer = require('nodemailer');
const readline = require('readline');
const bodyParser = require('body-parser');


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


//Check if the script is run directly using Node.js (Fixed interferance with Jest)



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
//---------CHECKOUT--------------

app.use(bodyParser.json());

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "public/checkout.html"));
});

app.post('/checkout', (req, res) => {
  console.log("Connected");
  // Parsing boolean values directly from req.body
  const userId = req.body.userId;
  const vehicleId = req.body.vehicleId;
  const isDamaged = req.body.isDamaged; // Assuming the client sends a boolean
  const damageDetails = req.body.damageDetails;
  const isStolen = req.body.isStolen;
  const email= req.body.email;
   // Assuming the client sends a boolean

  // Define constants for late fee and damage fee
  const LATE_FEE_PER_HOUR = 25; // Example value, adjust as needed
  const DAMAGE_FEE = 100; // Example value, adjust as needed

  // 1. Check reservation existence and deletion
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

    // Delete the reservation
    db.query('DELETE FROM HasReserved WHERE UserID = ? AND VehicleID = ?', [userId, vehicleId], (error, result) => {
      if (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      // 2. Calculate extra charges, if applicable
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

      // Omitting email sending for brevity

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
  from: 'mustafa.abulh4@gmail.com', // sender address
  to: email, // list of receivers
  subject: 'Checkout Confirmation', // Subject line
  text: `Hello,

Your checkout has been processed successfully.

Details:
- User ID: ${userId}
- Vehicle ID: ${vehicleId}
- Extra Charges: $${totalExtraCharges}
${isDamaged ? `\n- Damage Details: ${damageDetails}` : ''}
${isStolen ? '\n- Note: Vehicle reported stolen.' : ''}

Thank you for using our service.

Best,
Your Company Name`
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


/////////////////////////////////////////////////////////////////////////
if (require.main === module) {
  app.listen(8800, () => {
  console.log("Connected to backend.");
  });
}


