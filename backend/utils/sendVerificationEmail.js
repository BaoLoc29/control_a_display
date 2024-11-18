import nodemailer from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

// Cấu hình transporter với Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Cấu hình handlebars cho transporter
transporter.use(
    "compile",
    hbs({
        viewEngine: {
            extname: ".hbs",
            layoutsDir: path.resolve("./views"),
            defaultLayout: false,
        },
        viewPath: path.resolve("./views"),
        extName: ".hbs",
    })
);

// Hàm gửi email kích hoạt
export const sendVerificationEmail = async (name, activationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        // to: email, email sẽ tùy thuộc vào email đăng nhập nào
        subject: "Activate your account at ControlA",
        template: "register",
        context: {
            name,
            activationCode,
        },
    };

    await transporter.sendMail(mailOptions);
};
export const sendRetryPassword = async (name, activationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Change your password account at ControlA",
        template: "register",
        context: {
            name,
            activationCode,
        },
    };

    await transporter.sendMail(mailOptions);
};

export const sendOldEmail = async (oldEmail, name, newEmail, activationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        // to: oldEmail, // Gửi email tới địa chỉ cũ
        subject: "Your email address has been updated",
        template: "emailUpdate",
        context: {
            oldEmail,
            name,
            newEmail,
            activationCode,
        },
    };

    await transporter.sendMail(mailOptions);
};
// export const sendOldEmail = async (oldEmail, name, newEmail) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: oldEmail,
//         subject: "Notification Email Change",
//         template: "notification",
//         context: {
//             oldEmail,
//             name,
//             newEmail,
//         },
//     };

//     await transporter.sendMail(mailOptions);
// };

