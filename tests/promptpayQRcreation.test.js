let request = require('supertest');
const express = require('express');
require("dotenv").config();

request = request('http://localhost:5000');


describe("promptpayQRcreation", () => {
  
  it("should create a promptpayQR with value of /* TODO write */", async () => {
    const server = express();
    await server.listen(process.env.PORT);

    const res = await request
    .post("/api/v1/transactions/promptpayqr")
    .set('Accept', 'application/json')
    .send({appointmentID:"6603aab890e39a9c8f3be441"})
    .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDIzMzI0YjdiMmIxNWJhZThmYmRiYSIsImlhdCI6MTcxMTQyMDE5NiwiZXhwIjoxNzE0MDEyMTk2fQ.DS-Vbjt6SaSrFhB-mchMaU1s_-uN2r15gDWf9vPDW9E', { type: 'bearer' })
    .expect(200)
    .then(response => {
      console.log(response._body);
      expect(JSON.stringify(response._body.data)).toBeDefined();
    });
  })
})