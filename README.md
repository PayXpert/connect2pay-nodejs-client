# PayXpert NodeJS Library

The PayXpert NodeJS library provides convenient access to the Payxpert 
Payment Gateway and Connect2Pay API from applications written in server-side
JavaScript.

Please keep in mind that this package is for use with server-side Node that
uses PayXpert API credentials (originator ID and password). To maintain PCI 
compliance, tokenization of credit
card information should always be done with relevant software on the
client side. This package should not be used for that purpose.

## Documentation

See the [PayXpert API documentation](https://developers.payxpert.com).

## Installation

Install the package with:

    npm i payxpert --save

## Usage

The package needs to be configured with your originator Id and API KEY
(originator password):

``` js
const payxpert = require('payxpert')("10...", "xxx");
const accountInformation = await payxpert.connect2pay.accountInformation();
...
```
## Development

Run all tests:

```bash
$ export PXP_ORIGINATOR_ID=...
$ export PXP_ORIGINATOR_PASSWORD=...
$ npm install
$ npm test
```
