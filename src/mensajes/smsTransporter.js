import twilio from "twilio";
import 'dotenv/config'

async function enviarSMS(destinatario,mensaje) {
    const accountSid = `${process.env.TWILIO_ACC}`;
    const authToken = `${process.env.TWILIO_TOKEN}`;

    const client = twilio(accountSid, authToken);

    try {
        const message = await client.messages.create({
            body: `${mensaje}`,
            from: `${process.env.TWILIO_NUMBER}`,
            to: `${destinatario}`
        });
    } catch (error) {
       // console.log(error);
    }
}

export {enviarSMS}