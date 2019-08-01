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

module.exports.staticSiteMailer = (event, context, callback) => {
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

    callback(null, response);
  });
};

// function sendEmail(formData, callback) {
//   // Build the SES parameters
//   // Send the email
// }

// module.exports.staticSiteMailer = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: "Go Serverless v1.0! Your function executed successfully!",
//         input: event
//       },
//       null,
//       2
//     )
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
