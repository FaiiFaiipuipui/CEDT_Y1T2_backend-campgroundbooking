const generatePayload = require('promptpay-qr') 
const qrcode = require('qrcode') 

/**
 * @param promptPayID is either mobile number or national ID
 */
exports.createPromptPayQR = async (promptPayID, amount) => {
    const payload = generatePayload(promptPayID, { amount });

    // Convert to SVG QR Code
    const options = { type: 'svg', color: { dark: '#000', light: '#fff' } }
    return qrcode.toString(payload, options, (err, svg) => {
        if (err) {
            console.log(err);
            return 'error';
        }
        
        return svg;
    })
}
