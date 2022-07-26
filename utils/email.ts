import nodemailer from 'nodemailer';

import logger from '../utils/logger';

const sendMail = async (to: string, code: number) => {
  const {
    EMAIL_CLIENT_ADDRESS,
    EMAIL_CLIENT_PASSWORD,
    EMAIL_CLIENT_HOST,
    EMAIL_CLIENT_PORT,
  } = process.env;

  let transporter = nodemailer.createTransport({
    port: parseInt(EMAIL_CLIENT_PORT),
    secure: true,
    host: EMAIL_CLIENT_HOST,
    auth: {
      user: EMAIL_CLIENT_ADDRESS,
      pass: EMAIL_CLIENT_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: EMAIL_CLIENT_ADDRESS,
    to,
    subject: 'Scimetic | Account Verification',
    html: `Your account verification code is: <b>${code}</b>`,
  });

  logger.info('Account verification email sent: ', info.messageId);
};

export default sendMail;