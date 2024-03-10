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
