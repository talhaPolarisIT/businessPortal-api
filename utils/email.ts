import nodemailer from 'nodemailer';

import logger from '../utils/logger';
const { EMAIL_CLIENT_ADDRESS, EMAIL_CLIENT_PASSWORD, EMAIL_CLIENT_HOST, EMAIL_CLIENT_PORT } = process.env;

let transporter = nodemailer.createTransport({
  port: parseInt(EMAIL_CLIENT_PORT),
  secure: true,
  host: EMAIL_CLIENT_HOST,
  auth: {
    user: EMAIL_CLIENT_ADDRESS,
    pass: EMAIL_CLIENT_PASSWORD,
  },
});

const sendVerificationCode = async (to: string, code: number) => {
  let info = await transporter.sendMail({
    from: EMAIL_CLIENT_ADDRESS,
    to,
    subject: 'Business Portal | Account Verification',
    html: `Your account verification code is: <b>${code}</b>`,
  });

  logger.info('Account verification email sent: ', info.messageId);
};

const sendLoginInvitation = async (to: string, {  password, link }: {  password: string, link: string }) => {
  let info = await transporter.sendMail({
    from: EMAIL_CLIENT_ADDRESS,
    to,
    subject: 'Business Portal | Account Invitation',
    html: `<p>
    Your account at Business Portal has been created
    <br />
    Use following creadentials to login.
    <br />
    <b>Email:</b> ${to}
    <br />
    <b>Password:</b> ${password}
    <br />
    click on the link below: ${link}
  </p> </br>`,
  });

  logger.info('Account verification email sent: ', info.messageId);
};

const sendRestPassword = async (to: string) => {
  let info = await transporter.sendMail({
    from: EMAIL_CLIENT_ADDRESS,
    to,
    subject: 'Business Portal | Password Reset Notification',
    html: `Your account has requested Password rest.`,
  });

  logger.info('Rest password email sent: ', info.messageId);
};

export default {
  sendVerificationCode,
  sendLoginInvitation,
  sendRestPassword,
};
