const AWS = require("aws-sdk");
const SES = new AWS.SES();
const client = require("twilio");
const {
  SES_RECEIVING_EMAIL,
  SES_SENDING_EMAIL,
  SITE_NAME,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  WHATSAPP_FROM,
  WHATSAPP_TO
} = process.env;

const twilio = client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function sendEmail(formData, callback) {
  const sesReceivingEmail = SES_RECEIVING_EMAIL.split(",");

  const emailParams = {
    Source: SES_SENDING_EMAIL,
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: sesReceivingEmail
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New message from ${SITE_NAME}`
      }
    }
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, _, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": SITE_NAME || "*"
      },
      body: JSON.stringify({
        message: err ? err.message : data
      })
    };

    WHATSAPP_TO.split(",").map(to => {
      twilio.messages
        .create({
          body: `New message\nSite: ${SITE_NAME}\nFrom: ${formData.reply_to}\nMessage: ${formData.message}\nPlease check your inbox!`,
          from: `whatsapp:${WHATSAPP_FROM}`,
          to: `whatsapp:${to}`
        })
        .then(message => console.log(message.sid))
        .done();
    });

    callback(null, response);
  });
};
