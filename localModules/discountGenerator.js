
var voucher_codes = require('voucher-code-generator');
var Discount = require('../models/discount');

function getDiscount(time,percent,amount,user){
    return voucher=voucher_codes.generate({
        length: 8,
        count: 1,
        charset: voucher_codes.charset("alphanumeric")
    });

}
exports.getDiscount = getDiscount;