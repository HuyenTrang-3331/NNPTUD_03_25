const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "dd4e47f2f88bfc",
        pass: "1e9d96a6da37de",
    },
});

module.exports = {
    sendMail: async (to,url) => {
        const info = await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "RESET PASSWORD REQUEST",
            text: "lick vo day de doi pass", // Plain-text version of the message
            html: "lick vo <a href="+url+">day</a> de doi pass", // HTML version of the message
        });

        console.log("Message sent:", info.messageId);
    },
    sendPasswordMail: async (to, username, password) => {
        const info = await transporter.sendMail({
            from: 'admin@haha.com',
            to: to,
            subject: "YOUR NEW ACCOUNT",
            text: `Hello ${username}, your account has been created. Your password is: ${password}`,
            html: `<h3>Hello ${username}</h3><p>Your account has been created.</p><p>Your password is: <strong>${password}</strong></p>`,
        });

        console.log(`Password email sent to ${to}:`, info.messageId);
    }
}