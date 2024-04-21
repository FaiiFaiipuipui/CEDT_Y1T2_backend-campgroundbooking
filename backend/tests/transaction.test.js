const mongoose = require("mongoose");
const server = require("../server");
const Transaction = require("../models/Transaction");
const TransactionSlip = require("../models/TransactionSlip");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

let resTransaction;
let resSlip;

describe("transaction initiation", ()=>{
  it("should create a transaction document object", async () => {
    resTransaction = await Transaction.create({
      status: "PENDING",
      rent_date : Date.now(),
      successful_payment_date : Date.now(),
      campground : '66024aa295c74eace7ba13a0',
      user : '65e55e2345cd63e58bf949a4',
      appointment : '6603aa8a90e39a9c8f3be40b'
    });
    expect(resTransaction).toBeDefined();
    expect(resTransaction).toHaveProperty('status', 'PENDING');
    expect(resTransaction).toHaveProperty('rent_date');
    expect(resTransaction).toHaveProperty('successful_payment_date');
    expect(resTransaction).toHaveProperty('submitted_slip_images', []);
    expect(resTransaction).toHaveProperty('successful_payment_slip_image', null);
    expect(JSON.stringify(resTransaction.campground)).toEqual(JSON.stringify('66024aa295c74eace7ba13a0'));
    expect(JSON.stringify(resTransaction.user)).toEqual(JSON.stringify('65e55e2345cd63e58bf949a4'));
    expect(JSON.stringify(resTransaction.appointment)).toEqual(JSON.stringify('6603aa8a90e39a9c8f3be40b'));
  });
})

describe('transaction successful mock slip_image insertion', () => {
  it ('should create new transaction_slip document object', async () => {
    resSlip = await TransactionSlip.create({
      slip_image: Buffer.from('Hello World'),
      payment_id: resTransaction._id
    });
    expect(resSlip).toBeDefined();
    expect(resSlip).toHaveProperty('submit_time');
    expect(JSON.stringify(resSlip.payment_id)).toEqual(JSON.stringify(resTransaction._id));
    expect(JSON.stringify(Buffer.from('Hello World'))).toEqual(JSON.stringify(resSlip.slip_image));
  });

  it('should insert the slip ObjectId into the transaction array', async () => {
    resTransaction = await Transaction.findByIdAndUpdate(resTransaction._id,
      { $push: { submitted_slip_images: resSlip._id } },
      { new: true }
    );
    expect(resTransaction.submitted_slip_images.some(id => id.equals(resSlip._id))).toBeTruthy();
  });

  it('should insert the slip ObjectId into the successful_payment_slip_image', async () => {
    resTransaction = await Transaction.findByIdAndUpdate(resTransaction._id,
      { successful_payment_slip_image : resSlip._id },
      { new: true }
    );
    expect(JSON.stringify(resTransaction.successful_payment_slip_image)).toEqual(JSON.stringify(resSlip._id));
  })
})

describe("transaction and slip deletion *ONLY FOR TEST RESET PURPOSE*", () => {
  it("should delete a transaction document object", async () => {
    await Transaction.deleteOne(resTransaction._id);
    const deletedTransaction = await Transaction.findById(resTransaction._id);
    expect(deletedTransaction).toBeNull();
  });
  it('should delete a transaction_slip document object', async () => {
    await TransactionSlip.deleteOne(resSlip._id);
    const deletedSlip = await TransactionSlip.findById(resSlip._id);
    expect(deletedSlip).toBeNull();
  })
})

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});
