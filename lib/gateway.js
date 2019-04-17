'use strict';

const PaymentClient = require('./payment_client');
const config = require('./payment_config');

class GatewayClient extends PaymentClient {

    // region: Transaction operations

    /**
     * Sale operation (Authorize & Capture)
     * @param requestBody
     * @returns {Promise<any>}
     */
    async creditCardSale (requestBody) {
        return await this.makeRequest(config.GATEWAY_HOST, "/transaction/sale/creditcard", "POST", requestBody);
    }

    /**
     * Authorize money on customer's card account
     * @param requestBody
     * @returns {Promise<any>}
     */
    async creditCardAuthorize (requestBody) {
        return await this.makeRequest(config.GATEWAY_HOST, "/transaction/authorize/creditcard", "POST", requestBody);
    }

    /**
     * Capture from previously authorized transaction
     * @param transactionId String Transaction ID
     * @param requestBody
     * @returns {Promise<any>}
     */
    async creditCardCapture (transactionId, requestBody) {
        let url = "/transaction/" + transactionId + "/capture";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    /**
     * Perform a refund of transaction
     * @param transactionId String Transaction ID
     * @param requestBody
     * @returns {Promise<any>}
     */
    async refundTransaction (transactionId, requestBody) {
        let url = "/transaction/" + transactionId + "/refund";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    /**
     * Transfer funds to customer account
     * @param transactionId String Transaction ID
     * @param requestBody
     * @returns {Promise<any>}
     */
    async creditFundTransfer (transactionId, requestBody) {
        let url = "/transaction/" + transactionId + "/credit";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    /**
     * Cancel previously authorized transaction
     * @param transactionId String Transaction ID
     * @param requestBody
     * @returns {Promise<any>}
     */
    async cancelTransaction (transactionId, requestBody) {
        let url = "/transaction/" + transactionId + "/cancel";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    /**
     * Perform rebill of existing transaction
     * @param transactionId String Transaction ID
     * @returns {Promise<any>}
     */
    async rebillTransaction (transactionId, requestBody) {
        let url = "/transaction/" + transactionId + "/rebill";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    /**
     * Retrieve details about transaction
     * @param transactionId String Transaction ID
     * @returns {Promise<any>}
     */
    async queryTransaction (transactionId) {
        let url = "/transaction/" + transactionId;
        return await this.makeRequest(config.GATEWAY_HOST, url, "GET");
    }

    /**
     * Get the list of transactions
     * @param requestBody
     * @param transactionOperation {String|undefined} Not required parameter. Possible options are: sale, refund, credit, authorize, capture, cancel or rebill
     * @returns {Promise<any>}
     */
    async exportTransactionsList (requestBody, transactionOperation = null) {
        let url = "/transactions";

        if (transactionOperation) {
            const allowedOperations = ["sale", "refund", "credit", "authorize", "capture", "cancel", "rebill"];

            if (allowedOperations.indexOf(transactionOperation) > -1) {
                url = url + "/" + transactionOperation;
            } else {
                throw Error("Specified transaction operation is unknown. Allowed values are: " + allowedOperations.join(","));
            }
        }

        return await this.makeRequest(config.GATEWAY_HOST, url, "GET", requestBody);
    }

    /**
     * Blacklist users
     * @param transactionId String Transaction ID
     * @param requestBody
     * @returns {Promise<any>}
     */
    async blacklistUsers (transactionId, requestBody) {
        let url = "/transaction/" + transactionId + "/blacklist";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    async toditoCashSale (requestBody) {
        return await this.makeRequest(config.GATEWAY_HOST, "/transaction/sale/todito", "POST", requestBody);
    }

    // endregion

    // region Subscription operations

    /**
     * Instantly upgrade an existing subscription
     * @param subscriptionId
     * @returns {Promise<any>}
     */
    async instantConversion (subscriptionId) {
        let url = "/subscription/" + subscriptionId + "/instantconversion";
        return await this.makeRequest(config.GATEWAY_HOST, url, "POST");
    }

    /**
     * Cancel existing subscription
     * @param subscriptionId Subscription ID
     * @param cancelReason Integer code of cancellation reason
     * @returns {Promise<any>}
     */
    async cancelSubscription (subscriptionId, cancelReason) {
        let url = "/subscription/" + subscriptionId + "/cancel";

        let requestBody = {
            cancelReason: cancelReason
        };

        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    /**
     * Query current status of the subscription
     * @param subscriptionId
     * @returns {Promise<any>}
     */
    async querySubscription (subscriptionId) {
        let url = "/subscription/" + subscriptionId;
        return await this.makeRequest(config.GATEWAY_HOST, url, "GET");
    }

    /**
     * Export subscriptions from system
     * @param parameters
     * @returns {Promise<any>}
     */
    async exportSubscriptionsList(parameters) {
        return await this.makeRequest(config.GATEWAY_HOST, "/subscriptions", "GET", parameters);
    }

    /**
     * Export and get information of a subscription offer
     * @param offerId
     * @returns {Promise<any>}
     */
    async exportSubscriptionOffer(offerId) {
        let url = "/subscription/offer/" + offerId;
        return await this.makeRequest(config.GATEWAY_HOST, url, "GET");
    }

    // endregion

    // region 3D Secure operations

    /**
     * 3D secure check request
     * @param requestBody
     * @returns {Promise<any>}
     */
    async check3dSecure (requestBody) {
        return await this.makeRequest(config.GATEWAY_HOST, "/transaction/3dscheck/creditcard", "POST", requestBody);
    }

    /**
     * 3D secure response parse request
     * @param transactionId
     * @param paRes
     * @returns {Promise<any>}
     */
    async parse3dSecure (transactionId, paRes) {
        let url = "/transaction/" + transactionId + "/3dsparse";

        let requestBody = {
            transactionID: transactionId,
            PaRes: paRes
        };

        return await this.makeRequest(config.GATEWAY_HOST, url, "POST", requestBody);
    }

    // endregion

    // region Blacklist

    async blacklistValue (requestBody) {
        return await this.makeRequest(config.GATEWAY_HOST, "/blacklist", "POST", requestBody);
    }

    // endregion

}

module.exports = GatewayClient;