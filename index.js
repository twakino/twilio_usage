const request = require('request')
const moment = require('moment')

exports.handler = (event) => {
  
    const response = request.get(
      {
        uri: `https://api.twilio.com/2010-04-01/Accounts/${process.env.ACCOUNT_SID}/Usage/Records/ThisMonth.json?Category=pfax`,
        auth: {
            'user': process.env.ACCOUNT_SID,
            'pass': process.env.AUTH_TOKEN
        }
      }, function (error, response, body) {
        console.error(response.statusCode)
        if (!error && response.statusCode === 200) {
          const data = JSON.parse(body) 
          const price = Number(data["usage_records"][0]["price"])
          const payload = {
            text: `${moment().format('YYYY/MM/DD')}時点での支払額は${Math.round(price)}円です。(FAXのみ)`
          }
        
          request.post({
            uri: process.env.SLACK_URL,
            json: payload
          })
  
        } else {
          console.error(error)
        }
      })
    return {
      statusCode: 200
    }
}
