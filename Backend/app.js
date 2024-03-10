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

app.listen(8800, () => {
  console.log("Connected to backend.");
});

module.exports = app;
