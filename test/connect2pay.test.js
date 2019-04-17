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