const Auth = require('../Model/Auth');
const Validator = require('../Utilities/validator');
const {otpGenerator} = require("../Utilities/helpers");
const Merchant = require('../Model/Merchant');

exports.inValid = async (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Invalid Path'
    })
}