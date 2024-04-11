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
    "CREATE TABLE IF NOT EXISTS Vehicles (VehicleID INTEGER(9) PRIMARY KEY, Brand VARCHAR(255), Price DECIMAL(12, 2), Name VARCHAR(255), Mileage INTEGER(3), Images VARCHAR(2560), Seats INTEGER(1), Type VARCHAR(255), IsAvailable BOOLEAN);",
    "CREATE TABLE IF NOT EXISTS HasReserved (VehicleID INTEGER(9) PRIMARY KEY, UserID INTEGER(9), FOREIGN KEY (UserID) REFERENCES Users(UserID), StartTime DATETIME, EndTime DATETIME);",
    "CREATE TABLE IF NOT EXISTS Branch (id INT AUTO_INCREMENT PRIMARY KEY, location VARCHAR(255), open_hours VARCHAR(255));",
    "CREATE TABLE IF NOT EXISTS RentalLog (SNo INTEGER(9) NOT NULL AUTO_INCREMENT  PRIMARY KEY,VehicleID INTEGER(9) ,UserID INTEGER(9) , StartDate DATETIME, ReturnDate DATETIME , RentCost INTEGER(9));",
    "CREATE TABLE IF NOT EXISTS BranchVehicles (BranchID INT, VehicleID INT, PRIMARY KEY (BranchID, VehicleID), FOREIGN KEY (BranchID) REFERENCES Branch(id), FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID), UNIQUE (VehicleID));", 
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

// Function to insert initial data
function insertData() {
  const insert_values = [
    "INSERT INTO Vehicles (VehicleID, Brand, Price, Name, Mileage, Images, Seats, Type, IsAvailable) VALUES (1, 'Toyota', 25, 'Corolla', 30,'https://www.motortrend.com/uploads/sites/10/2018/07/2019-toyota-corolla-l-sedan-angular-front.png?fit=around%7C875:492', 5, 'sedan', false), (2, 'Honda', 35, 'Civic', 32, 'https://65e81151f52e248c552b-fe74cd567ea2f1228f846834bd67571e.ssl.cf1.rackcdn.com/ldm-images/2019-Honda-Civic-Platinum-White-Pearl.png', 5, 'sedan', true), (3, 'Ford', 30, 'Fusion', 28, 'https://www.motortrend.com/uploads/sites/10/2019/08/2020-ford-fusion-se-sedan-angular-front.png', 5, 'sedan', false),  (4, 'Hyundai', 28, 'Elantra', 31, 'https://www.hyundai-shf.com/assets/images/elantra/elantra-nav2.png', 5, 'sedan', true), (5, 'Kia', 27, 'Optima', 29, 'https://www.motortrend.com/uploads/sites/10/2015/11/2014-kia-optima-sx-sedan-angular-front.png', 5, 'sedan', true), (6, 'Chevrolet', 40, 'Malibu', 27, 'https://di-uploads-pod9.dealerinspire.com/sullivanparkhillautomotiveinc/uploads/2018/01/2018-Chevrolet-Malibu-L-Base-Hero.png', 5, 'sedan', true),    (7, 'Toyota', 40, 'RAV4', 25, 'https://d3ogcz7gf2u1oh.cloudfront.net/dealers/1000islands/assets/2022.rav4.awd.xle.premium-lrg.png', 5, 'suv', true), (8, 'Honda', 45, 'CR-V', 24, 'https://vehicle-images.dealerinspire.com/f1db-110007792/thumbnails/large/2HKRS6H85RH803563/76bdcc294315b33b17116d0c069890db.png', 5, 'suv', true), (9, 'Ford', 38, 'Escape', 26, 'https://di-uploads-pod41.dealerinspire.com/fordcrestview/uploads/2022/05/mlp-img-top-2022-escape-temp.png', 5, 'suv', true),  (10, 'Hyundai', 36, 'Tucson', 28, 'https://di-uploads-pod6.dealerinspire.com/siddillonautogroup/uploads/2020/09/2021-Hyundai-Tucson-SE.png', 5, 'suv', true), (11, 'Kia', 32, 'Sportage', 27, 'https://pngimg.com/d/kia_PNG23.png', 5, 'suv', true),  (12, 'Chevrolet', 42, 'Equinox', 26, 'https://www.motortrend.com/uploads/sites/10/2019/09/2020-chevrolet-equinox-lt-suv-angular-front.png', 5, 'suv', true),   (13, 'Toyota', 50, 'Highlander', 23, 'https://www.motortrend.com/uploads/sites/10/2015/11/2014-toyota-highlander-limited-suv-angular-front.png?fit=around%7C875:492', 7, 'suv', true),   (14, 'Honda', 48, 'Pilot', 22, 'https://www.honda.ca/-/media/Brands/Honda/Models/PILOT/2023/Overview/03_KeyFeatures/Honda_Pilot_key-features_desktop_1036x520.png?h=520&iar=0&w=1036&rev=571a070d190849209c9ede27422eec61&hash=1822A3D488F46A49791329C6810462EE', 7, 'suv', true),  (15, 'Ford', 52, 'Explorer', 21, 'https://minerva.leadboxhq.com/wp-content/uploads/2024/02/2024_ford_explorer_platinum_FL_StarWhiteMetallicTri-coat-800x443.png', 7, 'suv', true);",
    "INSERT INTO Users (UserID, ProfileImg, FirstName, LastName, ContactNo, Email, Password, Address, IsCust, IsAdmin, IsRep) VALUES (1, NULL, 'John', 'Doe', 1234567890, 'john@example.com', 'password123', '123 Main St', true, NULL, NULL),(2, NULL, 'Jane', 'Smith', 234567890, 'jane@example.com', 'password456', '456 Elm St', true, NULL, NULL),(3, NULL, 'Michael', 'Johnson', 346789012, 'michael@example.com', 'password789', '789 Oak St', true, NULL, NULL),(4, NULL, 'Emily', 'Brown', 456890123, 'emily@example.com', 'passwordabc', '456 Pine St', true, NULL, NULL),(5, NULL, 'Daniel', 'Martinez', 567801234, 'daniel@example.com', 'passworddef', '789 Maple St', true, NULL, NULL),(6, NULL, 'Sarah', 'Taylor', 678912345, 'sarah@example.com', 'passwordghi', '123 Cedar St', true, NULL, NULL),(7, NULL, 'Christopher', 'Anderson', 789013456, 'chris@example.com', 'passwordjkl', '456 Birch St', true, NULL, NULL),(8, NULL, 'Jessica', 'Wilson', 890234567, 'jessica@example.com', 'passwordmno', '789 Walnut St', true, NULL, NULL);",
    "INSERT INTO Branch (location, open_hours) VALUES ('Dollard-des-Ormeaux', '9AM - 6PM'), ('Anjou', '8AM - 5PM'), ('Brossard', '10AM - 7PM'), ('Westmount', '8:30AM - 6:30PM');", 
    "INSERT INTO BranchVehicles (BranchID, VehicleID) VALUES (1, 1), (1,2), (1, 3), (2, 4), (2, 5), (2,6), (2,7), (3,8), (3,9), (3,10), (4,11), (4,12), (4,13), (4,14), (4,15);", // assignment of vehicles to branches
    "INSERT INTO RentalLog (VehicleID, UserID, StartDate, ReturnDate, RentCost) VALUES (1, 1, '2021-01-15 10:00:00', '2021-05-20 15:00:00', 150), (2, 2, '2021-04-01 09:30:00', '2021-09-05 12:00:00', 180), (3, 3, '2021-12-10 08:00:00', '2022-09-15 17:00:00', 200), (4, 4, '2022-07-05 11:00:00', '2022-11-10 14:30:00', 170), (1, 5, '2023-01-20 14:45:00', '2023-08-25 16:45:00', 190), (2, 6, '2023-04-12 10:30:00', '2023-07-17 11:00:00', 160), (4, 7, '2023-12-08 08:15:00', '2024-05-13 18:15:00', 220), (3, 8, '2024-01-25 12:00:00', '2024-3-30 10:30:00', 175), (2, 1, '2024-01-03 09:00:00', '2024-06-08 14:00:00', 195), (1, 2, '2024-03-15 13:30:00', '2024-09-20 16:00:00', 210);"
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