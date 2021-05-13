(function() {
    const nodemailer = require('nodemailer');
    require('dotenv').config();


    const gmailCredential = {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    };
    const smtpConfig = {
        service : 'gmail',
        auth: gmailCredential
    };

    const transporter = nodemailer.createTransport(smtpConfig); 

    sendEmail = (mailOptions) => {
        return new Promise(async (res, rej) => {

            mailOptions.from = gmailCredential.user;
            const result = await send(mailOptions);
            res(result);
            // transporter.verify((err, verify) => {
            //     if(err) {
            //         console.log('config is not correct-->', err)
            //         res(null)
            //     } else {
            //         console.log('your config is correct--->', verify);
            //         res();
            //     }
            // });
        });
    },

    send = (mailOptions) => {
        return new Promise(async (res, rej) => {
            transporter.sendMail(mailOptions, (err, result) => {
                res(result);
            });
        }); 
    },

    module.exports = {
        sendEmail,
    };
}());