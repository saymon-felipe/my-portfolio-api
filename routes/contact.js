const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function constructEmail(name, email = "", tel = "", message = "") {
    let emailSend;
    if (email == "" || tel == "" || message == "") {
        emailSend = `
            <div style="margin: 25px 10px; font-family: Arial, Helvetica, sans-serif; color: #000;">
                <div style="margin-top: 15px;">
                    <p>Olá <strong>${name}</strong>, é um prazer falar com você!</p>
                    <p>
                        Vi que você enviou uma mensagem pra mim através do meu portfólio,
                        vou analisá-la e te respondo o mais breve possível viu?
                    </p>
                    <p>
                        Espero que esse contato seja apenas o início da nossa conversa! Até breve!
                    </p>
                    <h4><i>El psy congroo!!!</i></h4>
                </div>
                <div style="margin-bottom: 30px;">
                    <a href="https://saymon-felipe.github.io/my-portfolio/" target="_blank" rel="external">
                        <img src="https://lh3.googleusercontent.com/vQJIOT2U4fyo64xUbMr8XD6CW8OWIyRbeJ34Xm7kwUlFGvhX7KHcqOkffUUocpH1DYMFQwrJx85EMWTD=w595-h220-rw" style="width: 360px;">
                    </a>
                </div>
                <hr>
                <div style="max-width: 500px;">
                    <h5>Este é um email automático, porém você pode respondê-lo e eu irei lhe atender pessoalmente! <a href="mailto:saymonfelipe2001@gmail.com">saymonfelipe2001@gmail.com</a></h5>
                </div>
            </div>
        `;
    } else {
        emailSend = `
            <div style="margin: 25px 10px; font-family: Arial, Helvetica, sans-serif; color: #000;">
                <div style="margin-top: 15px;">
                    <h3>Alguém mandou uma mensagem!</h3>
                    <p>
                        <strong>Nome: </strong> ${name}
                    </p>
                    <p>
                        <strong>Email: </strong> ${email}
                    </p>
                    <p>
                        <strong>Tel: </strong> ${tel}
                    </p>
                    <p>
                        <strong>Mensagem: </strong> ${message}
                    </p>
                    <br>
                    <a href="mailto:${email}" style="text-decoration: none; color: #fff; background: #000; padding: 15px 25px; border-radius: 5px; text-align: center; font-weight: 600;">RESPONDER</a>
                    <br>
                    <br>
                    <br>
                </div>
                <div style="margin-bottom: 30px;">
                    <a href="https://saymon-felipe.github.io/my-portfolio/" target="_blank" rel="external">
                        <img src="https://lh3.googleusercontent.com/vQJIOT2U4fyo64xUbMr8XD6CW8OWIyRbeJ34Xm7kwUlFGvhX7KHcqOkffUUocpH1DYMFQwrJx85EMWTD=w595-h220-rw" style="width: 360px;">
                    </a>
                </div>
                <hr>
                <div style="max-width: 500px;">
                    <h5>Email automático enviado quando uma pessoa manda mensagem pela <br> tela de contato no portfólio</h5>
                </div>
            </div>
        `;
    }
    return emailSend;
}

router.post('/', (req, res, next) => {
    let sender_email = req.body.email,
        sender_name = req.body.name,
        sender_tel = req.body.tel,
        sender_message = req.body.message;

    let error_send = false;

    if (sender_email == undefined || sender_name == undefined || sender_tel == undefined || sender_message == undefined) {
        return res.status(400).send( {message: "Não é possível enviar, campos vazios!"});
    }

    transporter.sendMail({
        from: `Saymon Felipe <${process.env.EMAIL_USER}>`,
        to: sender_email,
        subject: `Obrigado pelo contato ${sender_name}!`,
        text: "Obrigado pelo contato. Retornarei em breve!",
        html: constructEmail(sender_name)
     }).then(message => {
        console.log(message)
        error_send = false;
     }).catch(err => {
        console.log(err);
        error_send = true;
     })

    transporter.sendMail({
        from: `ADM Portfólio <${process.env.EMAIL_USER}>`,
        to: "linnubr@gmail.com",
        subject: `Contato de ${sender_name}`,
        text: `${sender_name} te enviou uma mensagem através do portfólio.`,
        html: constructEmail(sender_name, sender_email, sender_tel, sender_message)
    }).then(message => {
        console.log(message)
        error_send = false;
    }).catch(err => {
        console.log(err);
        error_send = true;
    })

    const response = {
        message: "Email enviado com sucesso!",
        sender_email: sender_email,
        sender_name: sender_name
    }

    if (error_send) {
        const response = {
            message: "Falha no envio do email!"
        }
        return res.status(401).send(response);
    } else {
        return res.status(201).send(response);
    }
});

module.exports = router;