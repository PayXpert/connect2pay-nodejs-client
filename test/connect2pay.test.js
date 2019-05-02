const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;

const PaymentSDK = require('../lib/sdk');

const testData = require('../testUtils/testData');
const originatorId = testData.getOriginatorId();
const originatorPassword = testData.getOriginatorPassword();

it('checking originator credentials', (done) => {
    assert.notEqual(originatorId, "", "Originator ID not set");
    assert.notEqual(originatorPassword, "", "Originator password not set");

    done();
});

const connect2pay = PaymentSDK(originatorId, originatorPassword).connect2pay;

describe('Account information', () => {
    it('Account information request', async () => {
        let response = await connect2pay.accountInformation();
        assert.ok(response.apiVersion);

        return new Promise(resolve => {
            resolve();
        })
    });
});

describe('Payment operations', function() {
    this.timeout(5500);

    const amountForTest = 1000;

    const body = {
        "shippingType": "physical",
        "paymentMethod": "alipay",
        "paymentMode": "single",
        "amount":amountForTest,
        "currency":"EUR",
        "orderID":"NODEJS TEST"
    };

    let responseCreatePayment = null;

    it('create payment', async () => {
        responseCreatePayment = await connect2pay.createPayment(body);
        assert.equal(responseCreatePayment.code, "200");

        return new Promise(resolve => {
            resolve();
        })
    });

    it('consult payment status', async () => {
        let responseConsultPayment = await connect2pay.consultPaymentStatus(responseCreatePayment.merchantToken);
        assert.ok(responseConsultPayment.errorCode);

        return new Promise(resolve => {
            resolve();
        })
    });

    it('alipay direct payment call', async () => {
        let response = await connect2pay.createAliPayDirectPayment(responseCreatePayment.customerToken, { mode: "pos" });
        assert.equal(response.code, "200");

        return new Promise(resolve => {
            resolve();
        })
    });

});

describe('WeChat direct payment', function () {
    this.timeout(5500);

    const amountForTest = 1000;

    const body = {
        "shippingType": "physical",
        "paymentMethod": "wechat",
        "paymentMode": "single",
        "amount":amountForTest,
        "currency":"EUR",
        "orderID":"NODEJS TEST"
    };

    let responseCreatePayment = null;

    it('create payment', async () => {
        responseCreatePayment = await connect2pay.createPayment(body);
        assert.equal(responseCreatePayment.code, "200");

        return new Promise(resolve => {
            resolve();
        })
    });

    it('wechat direct payment call', async () => {
        let response = await connect2pay.createWeChatDirectPayment(responseCreatePayment.customerToken, { mode: "native" });
        assert.equal(response.code, "200");

        return new Promise(resolve => {
            resolve();
        })
    });

});


describe('Encryption', () => {

    it('handleRedirectStatus', () => {
        const encryptedData = "ZRHd0TeyKnQ6GwPMRk8x1eMv6iLCrvHkQ-w-QCEd5a7LIiebsWAzKvSDOQR1D3STZMV7MZ1raUJuzA9hesogP7HEAiSMgcx2etr9zaigZYjurnVwQlousUXvKYvLIuWHCHVlkU9ItAejW9DAVP2XiDDUdVXcEoFrTkS6M6a0XQH3w5_yejMyjwV83Rg2eRkKoG0y4B26n7bcbDzSKAn4xo5RKsH7X0t5wQSEwplzCPeHz6QOdGm4py0FZNXiDOf2DXwWmx7CcxFLig2kSj13X9eOiINA9R-Gqdqf4Ue1JJky-knoKqT6IstuAZGj9KyVnV9p2LN_NamaFF_QdiqPNspwKSYo2y06tyYu1fbn6C1RQHtImnedPqEr5DKtCkJiCLQ3DXmnhmPSGqiyvaDngzBYubHa8BNsBh8CFFvaVoCvE076yRL3C4Q8ttw119SEsnQoWrZImV7DQrdpY8BJivIKjXR3JYGeuRgIByRdJYuBM9CBRHOcSM6KS1NoC9uJ2QH_M0oOP2Nh-8E_tX9PyuTqqFI51Y9ToPLw2S80kymzgpuD13xtHubR902Aewz8JAsmgaQ_DZb5Gu1C1bMxuZkc0NLhzJBSIWPy1c3QdR73ppRxuTJIa1SIyWClFPhlNxJL3p8Wb9LXnGhMALC1tA3D_rzfQZfok5tr1AkmR-rQtxmYcYseeepxKayVe22VxF2BPSMmo0nh0sLOb3l30d1xwJ3rD8Mvsnty9V8sw0AxtJT3av6qfRKX-ITiYHjj";
        const merchantToken = "W2n1yR8UXNJBrJxbsqOy3g";

        let result = connect2pay.handleRedirectStatus(encryptedData, merchantToken);

        assert.ok(result);

        assert.equal(merchantToken, result.merchantToken);
        assert.equal("000", result.errorCode);
        assert.equal("Not processed", result.status);
    });

});