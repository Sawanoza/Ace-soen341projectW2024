const request = require("supertest");
const app = require("../Backend/app.js");

describe("GET /users", () => {
  it("responds with JSON containing all users", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("GET /vehicles", () => {
  it("responds with JSON containing all vehicles", async () => {
    const response = await request(app).get("/vehicles");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("POST /vehicles", () => {
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  it("responds with 200 redirect on successful vehicle creation", async () => {
    const newVehicle = {
      vehicleId: randomNumber.toString(),
      brand: "Test_brand",
      price: 9,
      name: "Test_name",
      mileage: 9,
      seats: 9,
      type: "Test_Type",
      isAvailable: true,
    };

    const response = await request(app).post("/item").send(newVehicle);

    expect(response.statusCode === 200 || response.statusCode === 302).toBe(
      true
    );
  });
});
//"INSERT INTO Users (UserID, ProfileImg, FirstName, LastName, ContactNo, Email, Password, Address, IsCust, IsAdmin, IsRep) VALUES (1, NULL, 'John', 'Doe', 1234567890, 'john@example.com', 'password123', '123 Main St', true, NULL, NULL)
describe("POST /users", () => {
  it("responds with JSON containing the newly created user", async () => {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    //Define the user data to send in the request
    const userData = {
      userId: randomNumber.toString(),
      profileImg: null,
      firstName: "testuser",
      lastName: "testuser",
      contactNo: 1234567,
      email: "testuser@test.com",
      password: "testpass",
      address: "testuser",
      isCust: null,
      isAdmin: true,
      isRep: null,
    };

    //Sends a POST request to create a new user
    const response = await request(app).post("/create_user").send(userData);

    expect(response.statusCode === 200 || response.statusCode === 302).toBe(
      true
    );
  });
});

describe("GET /reservations", () => {
  it("responds with JSON containing all reservations", async () => {
    const response = await request(app).get("/reservations");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("POST /reservations", () => {
  it("responds with JSON containing the newly created reservation", async () => {
    // Define the reservation data to send in the request
    const reservationData = {
      vehicleId: "2",
      userId: "8",
      startTime: "2024-03-10 09:00:00",
      endTime: "2024-03-14 15:45:00",
    };

    // Send a POST request to create a new reservation
    const response = await request(app)
      .post("/create_reservation")
      .send(reservationData);

    expect(response.statusCode === 200 || response.statusCode === 302).toBe(
      true
    );

  });
});



describe('DELETE /Users/:UserID', () => {
  it('Successful user deletion', async () => {
    const res = await request(app).delete('/Users/'); //Change the ID with an existing user.
    expect(res.status).toBe(200); 
    expect(res.text).toBe('User deleted successfully');
  });
});

describe('DELETE /Vehicles/:VehicleID', () => {
  it('Successful vehicle deletion', async () => {
    const res = await request(app).delete('/Vehicles/10'); //Change the ID with an existing vehicle.
    expect(res.status).toBe(200); 
    expect(res.text).toBe('Vehicle deleted successfully');
  });
});

describe('DELETE /HasReserved/:UserID/:VehicleID', () => {
  it('should cancel reservation if found', async () => {
    const res = await request(app)
      .delete('/HasReserved/3/13'); //Change the IDs with existing ones.
    expect(res.status).toBe(200); 
    expect(res.text).toBe('Reservation cancelled successfully');
  });
});
