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

describe("GET /reservations", () => {
  it("responds with JSON containing all reservations", async () => {
    const response = await request(app).get("/reservations");
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

describe("POST /users", () => {
  it("responds with JSON containing the newly created user", async () => {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;


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

    
    const response = await request(app).post("/create_user").send(userData);

    expect(response.statusCode === 200 || response.statusCode === 302).toBe(
      true
    );
  });
});

describe("POST /reservations", () => {
  it("responds with JSON containing the newly created reservation", async () => {
   
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

describe("DELETE /Users/:UserID", () => {
  it("Successful user deletion", async () => {
   
    const newUser = {
      userId: 100, 
      firstName: "Test",
      lastName: "User",
      contactNo: 1234567890,
      email: "test@example.com",
      address: "123 Test St",
      isCust: true,
      isAdmin: false,
      isRep: false,
    };

    await request(app).post("/create_user").send(newUser);

    
    const res = await request(app).delete(`/Users/${newUser.userId}`);

   
    expect(res.status).toBe(200);
    expect(res.text).toBe("User deleted successfully");
  });
});

describe("DELETE /Vehicles/:VehicleID", () => {
  it("Successful vehicle deletion", async () => {
   
    const newVehicle = {
      vehicleId: 1000, 
      brand: "TestBrand",
      price: 50,
      name: "TestVehicle",
      mileage: 20,
      seats: 4,
      type: "sedan",
      isAvailable: true,
    };

    await request(app)
      .post("/item")
      .send(newVehicle);

   
    const res = await request(app).delete(`/Vehicles/${newVehicle.vehicleId}`);
    
   
    expect(res.status).toBe(200);
    expect(res.text).toBe("Vehicle deleted successfully");
  });
});

describe("DELETE /HasReserved/:UserID/:VehicleID", () => {
  it("should cancel reservation if found", async () => {
    
    const newUser = {
      userId: 100, 
      firstName: "Test",
      lastName: "User",
      contactNo: 1234567890,
      email: "test@example.com",
      address: "123 Test St",
      isCust: true,
      isAdmin: false,
      isRep: false,
    };

    await request(app).post("/create_user").send(newUser);

    
    const newVehicle = {
      vehicleId: 1000, 
      brand: "TestBrand",
      price: 50,
      name: "TestVehicle",
      mileage: 20,
      seats: 4,
      type: "sedan",
      isAvailable: true,
    };

    await request(app).post("/item").send(newVehicle);

    
    const newReservation = {
      userId: newUser.userId, 
      vehicleId: newVehicle.vehicleId,
      startTime: "2024-03-25 09:00:00",
      endTime: "2024-03-27 17:00:00",
    };

    await request(app)
      .post("/create_reservation")
      .send(newReservation);

   
    const res = await request(app).delete(
      `/HasReserved/${newReservation.userId}/${newReservation.vehicleId}`
    );

    
    expect(res.status).toBe(200);
    expect(res.text).toBe("Reservation cancelled successfully");
  });
});

describe("GET /branches", () => {
  it("responds with JSON containing all branches", async () => {
    const response = await request(app).get("/branches");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
});

