let request = require('supertest');
const express = require('express');
require("dotenv").config();

request = request('http://localhost:5000');


describe("new payment", () => {
  
  it("should create a new payment", async () => {
    const server = express();
    await server.listen(process.env.PORT);

    const res = await request
    .post("/api/v1/transactions/6603aab890e39a9c8f3be441")
    .set('Accept', 'application/json')
    .send({promptpayID:"0967825577", appointmentID:"6603aab890e39a9c8f3be441", status:"PENDING"})
    .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDIzMzI0YjdiMmIxNWJhZThmYmRiYSIsImlhdCI6MTcxMTQyMDE5NiwiZXhwIjoxNzE0MDEyMTk2fQ.DS-Vbjt6SaSrFhB-mchMaU1s_-uN2r15gDWf9vPDW9E', { type: 'bearer' })
    .expect(201)
    .then(response => {
      console.log(response._body);
      expect(JSON.stringify(response._body.data.status)).toEqual(JSON.stringify("PENDING"))
    });
  })
})