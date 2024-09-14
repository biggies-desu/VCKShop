
const axios = require('axios')

const token = process.env.LINE_API_NOTIFICATION
console.log(token)

exports.notifyLine = async () => {
    try{
        const res = await axios({
            method: "POST",
            url: "https://notify-api.line.me/api/notify",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authentication: 'Bearer '+token
            },
            data: 'message=สวัสดี'
        })
        console.log(res)
    }
    catch(err)
    {
        console.log(err)
    }
}