(function() {
    const nodemailer = require('nodemailer');
    require('dotenv').config();


    const gmailCredental = {
        user: process.env.EMIAL_ID,
        pass: process.env.EMIAL_PASSWORD
    };
    const smtpConfig = {
        service : 'gmail',
        auth: gmailCredental
    };

    const transpoter = nodemailer.createTransport(smtpConfig); 

    sendEmail = (mailOptions) => {
        return new Promise(async (res, rej) => {

            mailOptions.from = gmailCredental.user;
            console.log('mailOptions=====>', mailOptions);
            const result = await send(mailOptions);
            result === null ? res(null) : res(result);

            // transpoter.verify((err, verify) => {
            //     if(err) {
            //         console.log('confir is not correct-->', err)
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
            transpoter.sendMail(mailOptions, (err, result) => {
                if (err) {
                    console.log('error -->', err);
                    res(null);
                } else {
                    console.log('email Sent successfully-->', result);
                    res(result);
                }
            });
        }); 
    },

    module.exports = {
        sendEmail
    };
}());