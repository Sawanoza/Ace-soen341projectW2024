const request = require('supertest');
const app = require('../Backend/index.js');



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

// IMPORTANT NOTE: If the test fails because 404 was received instead of 200, then the entered ID to delete DOES NOT EXIST.
