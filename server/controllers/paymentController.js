const crypto = require('crypto');

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const isDemoMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_xxxxxxxxxx';
    if (isDemoMode) {
      return res.json({ id: `order_demo_${Date.now()}`, amount: amount * 100, currency: 'INR', demoMode: true });
    }
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await rzp.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const isDemoMode = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_secret';
    if (isDemoMode) {
      return res.json({ verified: true, paymentId: razorpay_payment_id || `pay_demo_${Date.now()}` });
    }
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ verified: false, message: 'Signature mismatch.' });
    res.json({ verified: true, paymentId: razorpay_payment_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
