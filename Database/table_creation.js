var mysql = require("mysql");
var express = require("express");

const app = express();

app.listen(8800, () => {
  console.log("connected to back end");
});
// make sure mysql is set up on your local system
// use command "mysql -u root -p" to sign into sql in your terminal before running the code below
// "npm install mysql" in your local terminal to install the library we are using

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "idkidkpass",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

const create_tables = [
  "CREATE DATABASE Car_Rental;",
  "USE Car_Rental;",
  "CREATE TABLE Users (UserID INTEGER(9) PRIMARY KEY, ProfileImg VARCHAR(255), FirstName VARCHAR(255), LastName VARCHAR(255), ContactNo INTEGER(10), Email VARCHAR(255), Password VARCHAR(255), Address VARCHAR(255), IsCust BOOLEAN, IsAdmin BOOLEAN, IsRep BOOLEAN);",
  "CREATE TABLE Vehicles (VehicleID INTEGER(9) PRIMARY KEY, Brand VARCHAR(255), Price INTEGER(9), Name VARCHAR(255), Mileage INTEGER(3), Images VARCHAR(2560), Seats INTEGER(1), Type VARCHAR(255), IsAvailable BOOLEAN);",
  "CREATE TABLE HasReserved (VehicleID INTEGER(9) PRIMARY KEY, UserID INTEGER(9), FOREIGN KEY (UserID) REFERENCES Users(UserID), StartTime DATETIME, EndTime DATETIME);",
];
//const insert_values = [
  "INSERT INTO Vehicles (VehicleID, Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable) VALUES (1, 'Toyota', 25, 'Corolla', 30, NULL, 5, 'sedan', true), (2, 'Honda', 35, 'Civic', 32, NULL, 5, 'sedan', true), (3, 'Ford', 30, 'Fusion', 28, NULL, 5, 'sedan', true),  (4, 'Hyundai', 28, 'Elantra', 31, NULL, 5, 'sedan', true), (5, 'Kia', 27, 'Optima', 29, NULL, 5, 'sedan', true), (6, 'Chevrolet', 40, 'Malibu', 27, NULL, 5, 'sedan', true),    (7, 'Toyota', 40, 'RAV4', 25, NULL, 5, 'suv', true), (8, 'Honda', 45, 'CR-V', 24, NULL, 5, 'suv', true), (9, 'Ford', 38, 'Escape', 26, NULL, 5, 'suv', true),  (10, 'Hyundai', 36, 'Tucson', 28, NULL, 5, 'suv', true), (11, 'Kia', 32, 'Sportage', 27, NULL, 5, 'suv', true),  (12, 'Chevrolet', 42, 'Equinox', 26, NULL, 5, 'suv', true),   (13, 'Toyota', 50, 'Highlander', 23, NULL, 7, 'suv', true),   (14, 'Honda', 48, 'Pilot', 22, NULL, 7, 'suv', true),  (15, 'Ford', 52, 'Explorer', 21, NULL, 7, 'suv', true);",
  "INSERT INTO Users (UserID, ProfileImg, FirstName, LastName, ContactNo, Email, Password, Address, IsCust, IsAdmin, IsRep) VALUES (1, NULL, 'John', 'Doe', 1234567890, 'john@example.com', 'password123', '123 Main St', true, NULL, NULL),(2, NULL, 'Jane', 'Smith', 2345678901, 'jane@example.com', 'password456', '456 Elm St', true, NULL, NULL),(3, NULL, 'Michael', 'Johnson', 3456789012, 'michael@example.com', 'password789', '789 Oak St', true, NULL, NULL),(4, NULL, 'Emily', 'Brown', 4567890123, 'emily@example.com', 'passwordabc', '456 Pine St', true, NULL, NULL),(5, NULL, 'Daniel', 'Martinez', 5678901234, 'daniel@example.com', 'passworddef', '789 Maple St', true, NULL, NULL),(6, NULL, 'Sarah', 'Taylor', 6789012345, 'sarah@example.com', 'passwordghi', '123 Cedar St', true, NULL, NULL),(7, NULL, 'Christopher', 'Anderson', 7890123456, 'chris@example.com', 'passwordjkl', '456 Birch St', true, NULL, NULL),(8, NULL, 'Jessica', 'Wilson', 8901234567, 'jessica@example.com', 'passwordmno', '789 Walnut St', true, NULL, NULL);",
//];

create_tables.forEach((query) => {
  con.query(query, function (error, result) {
    if (error) {
      console.log("Error executing query");
      // Stop the loop if any query throws an error
      return;
    }
    console.log(result);
  });
});

insert_values.forEach((query) => {
  con.query(query, function (error, result) {
    if (error) {
      console.log("Error executing query");
      // Stop the loop if any query throws an error
      return;
    }
    console.log(result);
  });
});

con.query("SELECT * FROM Vehicles", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});

con.query("SELECT * FROM Users", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});

var mysql = require("mysql");
var express = require("express");

const app = express();

app.listen(8800, () => {
  console.log("connected to back end");
});
// make sure mysql is set up on your local system
// use command "mysql -u root -p" to sign into sql in your terminal before running the code below
// "npm install mysql" in your local terminal to install the library we are using

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "idkidkpass",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

const create_tables = [
  "CREATE DATABASE Car_Rental;",
  "USE Car_Rental;",
  "CREATE TABLE Users (UserID INTEGER(9) PRIMARY KEY, ProfileImg VARCHAR(255), FirstName VARCHAR(255), LastName VARCHAR(255), ContactNo INTEGER(10), Email VARCHAR(255), Password VARCHAR(255), Address VARCHAR(255), IsCust BOOLEAN, IsAdmin BOOLEAN, IsRep BOOLEAN);",
  "CREATE TABLE Vehicles (VehicleID INTEGER(9) PRIMARY KEY, Brand VARCHAR(255), Price INTEGER(9), Name VARCHAR(255), Mileage INTEGER(3), Images VARCHAR(2560), Seats INTEGER(1), Type VARCHAR(255), IsAvailable BOOLEAN);",
  "CREATE TABLE HasReserved (VehicleID INTEGER(9) PRIMARY KEY, UserID INTEGER(9), FOREIGN KEY (UserID) REFERENCES Users(UserID), StartTime DATETIME, EndTime DATETIME);",
];
//const insert_values = [
  "INSERT INTO Vehicles (VehicleID, Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable) VALUES (1, 'Toyota', 25, 'Corolla', 30, NULL, 5, 'sedan', true), (2, 'Honda', 35, 'Civic', 32, NULL, 5, 'sedan', true), (3, 'Ford', 30, 'Fusion', 28, NULL, 5, 'sedan', true),  (4, 'Hyundai', 28, 'Elantra', 31, NULL, 5, 'sedan', true), (5, 'Kia', 27, 'Optima', 29, NULL, 5, 'sedan', true), (6, 'Chevrolet', 40, 'Malibu', 27, NULL, 5, 'sedan', true),    (7, 'Toyota', 40, 'RAV4', 25, NULL, 5, 'suv', true), (8, 'Honda', 45, 'CR-V', 24, NULL, 5, 'suv', true), (9, 'Ford', 38, 'Escape', 26, NULL, 5, 'suv', true),  (10, 'Hyundai', 36, 'Tucson', 28, NULL, 5, 'suv', true), (11, 'Kia', 32, 'Sportage', 27, NULL, 5, 'suv', true),  (12, 'Chevrolet', 42, 'Equinox', 26, NULL, 5, 'suv', true),   (13, 'Toyota', 50, 'Highlander', 23, NULL, 7, 'suv', true),   (14, 'Honda', 48, 'Pilot', 22, NULL, 7, 'suv', true),  (15, 'Ford', 52, 'Explorer', 21, NULL, 7, 'suv', true);",
  "INSERT INTO Users (UserID, ProfileImg, FirstName, LastName, ContactNo, Email, Password, Address, IsCust, IsAdmin, IsRep) VALUES (1, NULL, 'John', 'Doe', 1234567890, 'john@example.com', 'password123', '123 Main St', true, NULL, NULL),(2, NULL, 'Jane', 'Smith', 2345678901, 'jane@example.com', 'password456', '456 Elm St', true, NULL, NULL),(3, NULL, 'Michael', 'Johnson', 3456789012, 'michael@example.com', 'password789', '789 Oak St', true, NULL, NULL),(4, NULL, 'Emily', 'Brown', 4567890123, 'emily@example.com', 'passwordabc', '456 Pine St', true, NULL, NULL),(5, NULL, 'Daniel', 'Martinez', 5678901234, 'daniel@example.com', 'passworddef', '789 Maple St', true, NULL, NULL),(6, NULL, 'Sarah', 'Taylor', 6789012345, 'sarah@example.com', 'passwordghi', '123 Cedar St', true, NULL, NULL),(7, NULL, 'Christopher', 'Anderson', 7890123456, 'chris@example.com', 'passwordjkl', '456 Birch St', true, NULL, NULL),(8, NULL, 'Jessica', 'Wilson', 8901234567, 'jessica@example.com', 'passwordmno', '789 Walnut St', true, NULL, NULL);",
//];

create_tables.forEach((query) => {
  con.query(query, function (error, result) {
    if (error) {
      console.log("Error executing query");
      // Stop the loop if any query throws an error
      return;
    }
    console.log(result);
  });
});

insert_values.forEach((query) => {
  con.query(query, function (error, result) {
    if (error) {
      console.log("Error executing query");
      // Stop the loop if any query throws an error
      return;
    }
    console.log(result);
  });
});

con.query("SELECT * FROM Vehicles", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});

con.query("SELECT * FROM Users", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});
