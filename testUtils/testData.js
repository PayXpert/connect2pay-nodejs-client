'use strict';

module.exports = {

    getOriginatorId: () => {
        return process.env.PXP_ORIGINATOR_ID || ''
    },

    getOriginatorPassword: () => {
        return process.env.PXP_ORIGINATOR_PASSWORD || ''
    }

};