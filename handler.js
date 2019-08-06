const AWS = require("aws-sdk");
const SES = new AWS.SES();

const { SES_SENDING_EMAIL, SES_RECEIVING_EMAIL, SITE_NAME } = process.env;

function sendEmail(formData, callback) {
  const emailParams = {
    Source: SES_SENDING_EMAIL,
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: [SES_RECEIVING_EMAIL]
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
        "Access-Control-Allow-Origin": "*" || SITE_NAME
      },
      body: JSON.stringify({
        message: err ? err.message : data
      })
    };

    callback(null, response);
  });
};
