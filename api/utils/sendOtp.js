import twilio from 'twilio';

const accountSid = 'ACcbf40122627ce934610ad8e61591b940';
const authToken = 'b1b0f181005da180b7ab9960997eff21';
const client = twilio(accountSid, authToken);

export const sendOtp = async (to, otpCode) => {
    try {
        const message = await client.messages.create({
            body: `Giriş kodunuz: ${otpCode}`,
            from: '+15074100523',
            to: to
        });
        console.log('OTP gönderildi:', message.sid);
    } catch (error) {
        console.error('OTP gönderme hatası:', error.message);
        throw new Error('OTP gönderilemedi');
    }
};
