const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

function dropDatabase() {
  const dropQuery = "DROP DATABASE IF EXISTS Car_Rental;";

  db.query(dropQuery, function (error, result) {
    if (error) {
      console.log("Error dropping database:", error.sqlMessage);
      return;
    }
    console.log("Database 'Car_Rental' dropped successfully.");
  });
}

function createTables() {
  const create_tables = [
    "CREATE DATABASE IF NOT EXISTS Car_Rental;",
    "USE Car_Rental;",
    "CREATE TABLE IF NOT EXISTS Users (UserID INTEGER(9) PRIMARY KEY, ProfileImg VARCHAR(255), FirstName VARCHAR(255), LastName VARCHAR(255), ContactNo INTEGER(10), Email VARCHAR(255), Password VARCHAR(255), Address VARCHAR(255), IsCust BOOLEAN, IsAdmin BOOLEAN, IsRep BOOLEAN);",
    "CREATE TABLE IF NOT EXISTS RentalLog (SNo INTEGER(9) NOT NULL AUTO_INCREMENT  PRIMARY KEY,VehicleID INTEGER(9) ,UserID INTEGER(9) , ReturnDate DATETIME , RentCost INTEGER(9));",
    "CREATE TABLE IF NOT EXISTS Vehicles (VehicleID INTEGER(9) PRIMARY KEY, Brand VARCHAR(255), Price INTEGER(9), Name VARCHAR(255), Mileage INTEGER(3), Images VARCHAR(2560), Seats INTEGER(1), Type VARCHAR(255), IsAvailable BOOLEAN);",
    "CREATE TABLE IF NOT EXISTS HasReserved (VehicleID INTEGER(9) PRIMARY KEY, UserID INTEGER(9), FOREIGN KEY (UserID) REFERENCES Users(UserID), StartTime DATETIME, EndTime DATETIME);",
  ];
// SELECT Vehicle.Brand, Vehicle.Name , Vehicle.ID , Vehicle.Mileage ,Vehicle.Seats  FROM User , Vehicles , HasReserved WHERE User.UserID == "{id_String}" AND 
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

db.connect(function (err) {
  if (err) throw err;
  console.log("connected");
  dropDatabase();
  createTables();
  insertData();
});

module.exports = db;
