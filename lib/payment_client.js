'use strict';

const https = require('https');
const qs = require("querystring");

class PaymentClient {

    /**
     * Create new instance
     * @param originatorId
     * @param originatorPassword
     */
    constructor(originatorId, originatorPassword) {
        this.originatorId = originatorId;
        this.originatorPassword = originatorPassword;
    }

    async makeRequest(host, path, method, body) {

        let _path = (body && method == 'GET') ? path + '?' + qs.stringify(body) : path;

        let requestOptions = {
            hostname: host,
            port: 443,
            path: _path,
            method: method,
            headers: {
                'Authorization': 'Basic ' + Buffer.from(this.originatorId + ':' + this.originatorPassword).toString('base64')
            }
        };

        return new Promise((resolve, reject) => {

            let request = https.request(requestOptions, (res) => {
                let chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    let body = Buffer.concat(chunks);
                    let bodyString = body.toString("UTF8");
                    resolve(JSON.parse(bodyString));
                });
            }).on("error", (err) => {
                console.log("Payment SDK request error: " + err.message);
                reject(err);
            });

            if (body) {
                if (method != "GET") {
                    request.write(JSON.stringify(body));
                }
            }

            request.end();

        });
    }


}

module.exports = PaymentClient;