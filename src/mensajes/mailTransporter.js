import {createTransport} from 'nodemailer'

export default async function enviarEmail(emailfrom,emailto,asunto,mensaje){
    const transporter = createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: `${emailfrom.email}`,
            pass: `${emailfrom.password}` 
        } 
    })

    const mailOptions = {
        from: `Mensaje desde el servidor`,
        to: `${emailfrom.email}`,
        subject: asunto,
        html: mensaje
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        //console.log(info)
    } catch (error) {
        //console.log(error)
    }
}