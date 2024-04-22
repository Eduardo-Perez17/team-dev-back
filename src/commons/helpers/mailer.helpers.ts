import * as nodemailer from 'nodemailer';

// Templates
import { emailVerification } from './templateHtml.helpers';

const transporter = nodemailer.createTransport({
  host: process.env.HOST_EMAIL,
  port: process.env.PORT_EMAIL,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});

export const verificationAccountMailer = async ({
  user,
  code,
}: {
  user: string;
  code: string;
}) => {
  await transporter.sendMail({
    from: '"Verificación de cuenta Team Dev" <Team Dev>',
    to: user,
    subject: 'Verificación de cuenta por medio de email😎',
    html: emailVerification({ code }),
  });
};
