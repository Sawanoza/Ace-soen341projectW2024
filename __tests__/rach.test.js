const request = require('supertest');
const app = require("../Backend/app.js");

describe('GET /users', () => {
  it('responds with JSON containing all users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
   
  });
});

describe('GET /vehicles', () => {
  it('responds with JSON containing all vehicles', async () => {
    const response = await request(app).get('/vehicles');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    
  });
});

describe('POST /vehicles', () => {
  it('responds with 302 redirect on successful vehicle creation', async () => {
    const newVehicle = {
      vehicleId: '123',
      brand: 'Toyota',
      price: 20000,
      name: 'Corolla',
      mileage: 50000,
      seats: 5,
      type: 'Sedan',
      isAvailable: true,
    };

    const response = await request(app)
      .post('/item')
      .send(newVehicle);

    expect(response.statusCode).toBe(302);
    
    expect(response.headers.location).toBe('/read_vehicles');
    
  });
});















describe('POST /users', () => {
  it('responds with JSON containing the newly created user', async () => {
    
    //Define the user data to send in the request
    const userData = {
      userId: 123,
      firstName: 'testuser',
      lastName: 'testuser',
      contactNo: 1234567890,
      email:'testuser@test.com',
      address: 'testuser',
      isCust: true,
      isAdmin: false,
      isRep: false,
    };

    //Sends a POST request to create a new user
    const response = await request(app)
      .post('/users')
      .send(userData);

    expect(response.statusCode).toBe(200); 
    expect(response.body).toBeDefined();
    expect(response.body.firstName).toBe(userData.firstName);
    expect(response.body.lastName).toBe(userData.lastName);
    expect(response.body.contactNo).toBe(userData.contactNo);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.address).toBe(userData.address);
    expect(response.body.isCust).toBe(userData.isCust);
    expect(response.body.isAdmin).toBe(userData.isAdmin);
    expect(response.body.isRep).toBe(userData.isRep);
  });
});



describe('POST /reservations', () => {
  it('responds with JSON containing the newly created reservation', async () => {
    
    // Define the reservation data to send in the request
    const reservationData = {
      vehicleId: 'user_id_here',
      userId: '2024-03-15',
      startTime: /** TO BE MODIFIED */,
      endTime: /** TO BE MODIFIED */,
    };

    // Send a POST request to create a new reservation
    const response = await request(app)
      .post('/hasreservation')
      .send(reservationData);

    expect(response.statusCode).toBe(/** TO BE MODIFIED */);
    expect(response.body).toBeDefined();
    expect(response.body.vehicleId).toBe(reservationData.vehicleId); 
    expect(response.body.userId).toBe(reservationData.userId);
    expect(response.body.startTime).toBe(reservationData.startTime);
    expect(response.body.endTime).toBe(reservationData.endTime);
  });
});



describe('GET /reservations', () => {
  it('responds with JSON containing all reservations', async () => {
    const response = await request(app).get('/reservations');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});