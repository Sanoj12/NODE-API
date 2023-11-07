const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');



const sendEmail = asyncHandler(async (data, req, res,) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 456,
        secure: true, //true for port:456 and  others port are false
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "sanojcsam123gmail.com",
            pass:"mpsxjahuixhlhxfm"
        }
    });

  
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"HI " <abc@gmail.com>', // sender address
            to:data.to, // list of receivers
            subject:data.subject, // Subject line
            text:data.text, // plain text body
            html: data.html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        console.log("preview URL:%s" ,nodemailer.getTestMessageUrl(info))
        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
    });


module.exports = sendEmail;