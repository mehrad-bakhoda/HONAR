require('dotenv').config();
const generateOTP = require("./generateOTP.js");
		const request = require('request');

    function sendSMS(verificationCode,phoneNumber){

      const request = require('request');
                        request.post({
                            url: 'http://ippanel.com/api/select',
                            body: {
          "op":"pattern",
          "user":`${process.env.SMS_PANNEL_USER}`,
          "pass":`${process.env.SMS_PANNEL_PASSWORD}`,
          "fromNum":`${process.env.SMS_PANNEL_USING_NUMBER}`,
          "toNum":`${phoneNumber}`,
          "patternCode":`${process.env.SMS_PANNEL_PATTERN_KEY}`,
          "inputData":[
              {"verification-code":verificationCode},
              
            ]
        },
                            json: true,
                        }, function (error, response, body) {
                            if (!error && response.statusCode === 200) {
        //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
                                console.log(response.body);
                            } else {
        console.log("failed");

                            }
                        });
    }
    exports.sendSMS = sendSMS;
