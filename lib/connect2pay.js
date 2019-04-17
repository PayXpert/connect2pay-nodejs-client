'use strict';

const PaymentClient = require('./payment_client');
const config = require('./payment_config');

function setApiVersion(requestBody) {
    if (typeof requestBody.apiVersion !== 'undefined' || !requestBody.apiVersion) {
        requestBody.apiVersion = "002.60";
    }
}

class Connect2PayClient extends PaymentClient {

    /**
     * Create Connect2Pay payment
     * @param requestBody
     * @returns {Promise<any>}
     */
    async createPayment(requestBody) {
        setApiVersion(requestBody);
        return await this.makeRequest(config.CONNECT2_PAY_HOST, "/transaction/prepare", "POST", requestBody);
    }

    /**
     * Retrieve information about payment
     * @param merchantToken
     * @returns {Promise<any>}
     */
    async consultPaymentStatus(merchantToken) {
        let url = "/transaction/" + merchantToken + "/status";
        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "GET");
    }

    /**
     * Retrieve information about transaction
     * @param transactionId
     * @returns {Promise<any>}
     */
    async transactionInformation(transactionId) {
        let url = "/transaction/" + transactionId + "/info";

        let requestBody = {
            apiVersion: "002.60"
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "GET", requestBody);
    }

    /**
     * Cancel previously authorized transaction
     * @param transactionId ID of transaction
     * @param amount Amount to cancel
     * @returns {Promise<any>}
     */
    async cancelTransaction(transactionId, amount) {
        let url = "/transaction/" + transactionId + "/cancel";

        let requestBody = {
            apiVersion: "002.60"
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
    }

    /**
     * Refund a transaction
     * @param transactionId ID of transaction
     * @param amount Amount to refund
     * @returns {Promise<any>}
     */
    async refundTransaction(transactionId, amount) {
        let url = "/transaction/" + transactionId + "/refund";

        let requestBody = {
            apiVersion: "002.60"
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
    }

    /**
     * Rebill a transaction
     * @param transactionId ID of transaction
     * @param amount Amount to rebill
     * @returns {Promise<any>}
     */
    async rebillTransaction(transactionId, amount) {
        let url = "/transaction/" + transactionId + "/rebill";

        let requestBody = {
            apiVersion: "002.60"
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
    }

    /**
     * Cancel a subscription
     * @param subscriptionId Subscription ID for cancelling
     * @param cancelReason Code of cancellation reason (https://developers.payxpert.com/reference/cancellation-reasons/)
     * @returns {Promise<any>}
     */
    async cancelSubscription(subscriptionId, cancelReason) {
        let url = "/subscription/" + subscriptionId + "/rebill";

        let requestBody = {
            apiVersion: "002.60",
            cancelReason: cancelReason
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
    }

    /**
     * Create WeChat direct payment
     * @param customerToken
     * @param requestBody
     * @returns {Promise<any>}
     */
    async createWeChatDirectPayment(customerToken, requestBody) {
        let url = "/payment/" + customerToken + "/process/wechat/direct";
        setApiVersion(requestBody);

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
    }

    async createAliPayDirectPayment(customerToken, requestBody) {
        let url = "/payment/" + customerToken + "/process/alipay/direct";
        setApiVersion(requestBody);

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
    }

    /**
     * Retrieve information about merchant account
     * @returns {Promise<any>}
     */
    async accountInformation() {
        return await this.makeRequest(config.CONNECT2_PAY_HOST, "/account", "GET")
    }
}

module.exports = Connect2PayClient;