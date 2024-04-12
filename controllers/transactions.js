const { createPromptPayQR } = require("../utils/createPromptpayQR")

/**
 * @desc create promptpayQR with req body
 * @route POST /api/v1/transactions
 * @access Private
 * @param req.body : promptpayID, amount
 */
exports.createPromptpayQR = (req, res, next) => {
  try {
    const data = req.body;

    if (!data.promptpayID || !data.amount) {
      throw new Error("promptpayID or amount is missing in the request body");
    }

    const returnData = createPromptPayQR(data.promptpayID, data.amount);
  
    if (returnData === 'error') {
      throw new Error("QR code Creation Function failed");
    }

    res.status(200).json({
      success: true,
      data: returnData
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to create promptpayQR",
    });
  }
}