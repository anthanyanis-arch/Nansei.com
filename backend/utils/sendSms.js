const twilio = require('twilio');

const sendSms = async (phone, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || accountSid.includes('your_') || !authToken || authToken.includes('your_')) {
    console.warn(`[SMS] Twilio not configured — OTP for +91${phone}: ${otp}`);
    return;
  }

  const client = twilio(accountSid, authToken);
  await client.messages.create({
    body: `Your Nansei Organics verification code is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
    from,
    to: `+91${phone}`
  });

  console.log(`[SMS] OTP sent to +91${phone}`);
};

module.exports = sendSms;
