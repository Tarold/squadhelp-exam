const nodemailer = require('nodemailer');
const CONSTANTS = require('../constants');

const address = 'http://localhost:3000/contest/';

async function getTestTransporter () {
  const testAccount = await nodemailer.createTestAccount();

  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return testTransporter;
}

async function getTransporter () {
  const transporter = nodemailer.createTransport({
    host: CONSTANTS.CONTACT_EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: CONSTANTS.CONTACT_EMAIL,
      pass: CONSTANTS.CONTACT_EMAIL_PASSWORD,
    },
  });
  return transporter;
}
const mailOptions = ({ email, offer }) => {
  return {
    from: CONSTANTS.CONTACT_EMAIL,
    to: email,
    subject: 'Moderator has reviewed your offer',
    text: `
      Dear Creator,
    
    We hope this email finds you well. We wanted to inform you that a moderator has reviewed your offer.
    
      Offer Details:
    
    Offer ID: ${offer.id}
    Text: ${offer.text}
    Approval Status: ${offer.approvedStatus}
    
    We appreciate your contribution and value your participation. Your approved offer will now be processed accordingly.
    
    To access the Squadhelp contest page, click on the following link: 
      ${address}${offer.contestId}
    
    If you have any further questions or concerns, please don't hesitate to reach out to us. We are here to assist you.
    
    Thank you for your continued support.
    
    Best regards,
    Squadhelp
    `,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <title>Moderator Approval</title>
    </head>
    <body>
      <h2>Dear Creator,</h2>
      
      <p>We hope this email finds you well. We wanted to inform you that a moderator has reviewed your offer.</p>
      
      <h3>Offer Details:</h3>
      <ul>
        <li><strong>Offer ID:</strong> ${offer.id}</li>
        <li><strong>Text:</strong> ${offer.userId}</li>
        <li><strong>Approval Status:</strong> ${offer.approvedStatus}</li>
      </ul>
      
      <p>We appreciate your contribution and value your participation. Your approved offer will now be processed accordingly.</p>
      
      <!-- Button with link to Squadhelp contest page -->
      <p>
        <a href="${address}${offer.contestId}" style="display: inline-block; background-color: #3f51b5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Go to Contest Page
        </a>
      </p>
      
      <p>If the button above doesn't work, you can manually copy and paste the following link into your web browser:</p>
      
      <!-- Link in case the button doesn't work -->
      <p><a href="${address}${offer.contestId}">${address}${offer.contestId}</a></p>
      
      <p>If you have any further questions or concerns, please don't hesitate to reach out to us. We are here to assist you.</p>
      
      <p>Thank you for your continued support.</p>
      
      <p>Best regards,<br>
      Squadhelp<br>
      ${CONSTANTS.CONTACT_EMAIL}</p>
    </body>
    </html>
    `,
  };
};

module.exports.sendOfferMessage = async props => {
  let transporter;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    transporter = await getTestTransporter();
  } else {
    transporter = await getTransporter();
  }
  try {
    const info = await transporter.sendMail(mailOptions(props));

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log('Email :>> ', nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    next(err);
  }
};
