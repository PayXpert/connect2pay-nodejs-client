'use strict';

module.exports = {

    getOriginatorId: () => {
        return process.env.PXP_ORIGINATOR_ID || ''
    },

    getOriginatorPassword: () => {
        return process.env.PXP_ORIGINATOR_PASSWORD || ''
    },

    getTransactionId: () => {
        return process.env.PXP_TRANSACTION_ID || ''
    }

};