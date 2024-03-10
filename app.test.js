const request = require('supertest');
const app = require('./app'); // import your express app

describe('PUT /vehicles/:vehicleId', () => {
  it('should update vehicle details', async () => {
    const res = await request(app)
      .put('/vehicles/1') // replace '1' with an actual vehicleId that exists in your database
      .send({
        Brand: 'Test Brand',
        Price: 10000,
        Name: 'Test Name',
        Mileage: 5000,
        Images: 'test.jpg',
        Seats: 4,
        Type: 'SUV',
        IsAvailable: true,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Vehicle updated successfully');
  });
});

describe('PUT /users/:userId', () => {
  it('should update user details', async () => {
    const res = await request(app)
      .put('/users/1') // replace '1' with an actual userId that exists in your database
      .send({
        firstName: 'John',
        lastName: 'Doe',
        contactNo: '1234567890',
        email: 'john.doe@example.com',
        address: '123 Main St',
        isCust: true,
        isAdmin: false,
        isRep: false,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User updated successfully');
  });
});