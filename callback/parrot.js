//gittest nakamura
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');
 
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
 
app.post('/callback', (req, res) => {
    async.waterfall(
        [
            // ユーザからのLINEレスポンスを取得
            (callback) => {
                var json = req.body;
                var responseMsg = json['result'][0]['content']['text'];
 
                callback(null, json, responseMsg);
            }
        ],
 
        (err, json, resultMsg) => {
            if (err) {
                return;
            }
 
            // LINEBOTから返信用のヘッダーをセット
            var headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Line-ChannelID': 1479418692,
                'X-Line-ChannelSecret': '416f5c0dba7baafd081863b883b7e3fd',
                'X-Line-Trusted-User-With-ACL': 'u774a75594d6d5f4449774679b608422f'
            };
 
            var to_array = [];
            to_array.push(json['result'][0]['content']['from']);
 
            // LINEBOTから返信用のデータをセット
            var sendData = {
                'to': to_array,
                'toChannel': 1383378250, // 今のところ固定
                'eventType': '138311608800106203', // 今のところ固定
                "content": {
                    contentType: 1,
                    toType: 1,
                    text: resultMsg
                }
            };
 
            var options = {
                url: 'https://trialbot-api.line.me/v1/events',
                headers: headers,
                json: true,
                body: sendData
            };
 
            // LINEBOTから返信リクエスト
            request.post(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log('error: ' + JSON.stringify(response));
                }
            });
        }
    );
});
 
app.listen(app.get('port'), function() {
    console.log('Node app is running');
});
