var nodemailer = require('nodemailer');
const CONSTANTS = require('../constants');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'umenaotvet',
    pass: CONSTANTS.CONTACT_EMAIL_PASSWORD,
  },
});

const mailOptions = ({ email, offer }) => {
  console.log('offer :>> ', email, offer);
  return {
    from: CONSTANTS.CONTACT_EMAIL,
    to: 'ltdecorer@gmail.com',
    subject: 'Moderator has reviewed your offer',
    text: `Dear Creator,

    We hope this email finds you well. We wanted to inform you that a moderator has reviewed your offer.
    
    Here are the details of your offer:
    
    Text: '7'
    Approval Status: ${offer.isApproved}

    squadhelp.com/contests/${1}
    
    If you have any further questions or concerns, please don't hesitate to reach out to us. We are here to assist you.
    
    Thank you for your continued support.
    
    Best regards,
    Squadhelp
    `,
  };
};

module.exports.sendOfferMessage = props => {
  transporter.sendMail(mailOptions(props), function (error, info) {
    if (error) {
      console.log('object :>> ', Error(error));
    } else {
      return true;
    }
  });
};
