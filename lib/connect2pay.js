'use strict';

const PaymentClient = require('./payment_client');
const config = require('./payment_config');

const defaultApiVersion = "002.70";

function setApiVersion(requestBody) {
    if (typeof requestBody.apiVersion !== 'undefined' || !requestBody.apiVersion) {
        requestBody.apiVersion = defaultApiVersion;
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
        const response = await this.makeRequest(config.CONNECT2_PAY_HOST, "/transaction/prepare", "POST", requestBody);

        if (response.customerToken) {
            response.customerRedirectURL = "https://" + config.CONNECT2_PAY_HOST + "/payment/" + response.customerToken
        }

        return response;
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
            apiVersion: defaultApiVersion
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "GET", requestBody);
    }

    /**
     * Cancel previously authorized transaction
     * @param transactionId ID of transaction
     * @param amount Amount to cancel
     * @returns {Promise<any>}
     */
    async captureTransaction(transactionId, amount) {
        let url = "/transaction/" + transactionId + "/capture";

        let requestBody = {
            apiVersion: defaultApiVersion,
            amount: amount
        };

        return await this.makeRequest(config.CONNECT2_PAY_HOST, url, "POST", requestBody);
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
            apiVersion: defaultApiVersion,
            amount: amount
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
            apiVersion: defaultApiVersion,
            amount: amount
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
            apiVersion: defaultApiVersion,
            amount: amount
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
            apiVersion: defaultApiVersion,
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

    /**
     * Create AliPay direct payment
     * @param customerToken
     * @param requestBody
     * @returns {Promise<any>}
     */
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

    /**
     * Retrieve list of transactions from Connect2Pay
     * @param requestBody
     * @returns {Promise<unknown>}
     */
    async exportTransactionsList (requestBody) {
        return await this.makeRequest(config.CONNECT2_PAY_HOST, "/transactions/export", "GET", requestBody);
    }

    /**
     * Decrypt the redirect status provided by Connect2Pay
     *
     * @param encryptedData
     * @param merchantToken
     * @returns {any}
     */
    handleRedirectStatus(encryptedData, merchantToken) {
        const crypto = require('crypto');

        let encryptedDataOriginal = Buffer.from(encryptedData, "base64");
        let merchantTokenOriginal = Buffer.from(merchantToken, "base64");

        let iv = crypto.randomBytes(16);

        let decryptor = crypto.createDecipheriv("aes-128-ecb", merchantTokenOriginal, '');
        let decoded = decryptor.update(encryptedDataOriginal, 'base64', 'utf-8');
        decoded += decryptor.final('utf-8');

        return JSON.parse(decoded);
    }
}

module.exports = Connect2PayClient;