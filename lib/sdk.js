'use strict';

const _GatewayClientObject = require('./gateway');
const _Connect2PayClientObject = require('./connect2pay');

function PaymentSDK(originatorId, originatorPassword) {
    if (!(this instanceof PaymentSDK)) {
        return new PaymentSDK(originatorId, originatorPassword);
    }

    this.setOriginatorId(originatorId);
    this.setOriginatorPassword(originatorPassword);

    this._paymentGateway = null;
    this._connect2Pay = null;

    Object.defineProperty(this, 'gateway', {
        get: function() {
            if (this._paymentGateway == null) {
                this._paymentGateway = new _GatewayClientObject(originatorId, originatorPassword);
            }

            return this._paymentGateway;
        }
    });

    Object.defineProperty(this, 'connect2pay', {
        get: function() {
            if (this._connect2Pay == null) {
                this._connect2Pay = new _Connect2PayClientObject(originatorId, originatorPassword);
            }

            return this._connect2Pay;
        }
    });
}

PaymentSDK.prototype = {

    setOriginatorId: function(originatorId) {
        if (originatorId) {
            this._paymentGateway = null;
            this._originatorId = originatorId;
        }
    },

    setOriginatorPassword: function(originatorPassword) {
        if (originatorPassword) {
            this._paymentGateway = null;
            this._originatorPassword = originatorPassword;
        }
    }
};

module.exports = PaymentSDK;