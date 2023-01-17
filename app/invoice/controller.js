const Invoice = require('./model');
const Order = require('../order/model');
const policyFor = require('../policy');
const { subject } = require('@casl/ability');
const midtransClient = require('midtrans-client');
const config = require('../config');

let snap = new midtransClient.Snap({
  isProduction: config.midtrans.isProduction === 'true',
  serverKey: config.midtrans.serverKey,
});

const show = async (request, response, next) => {
  const policy = policyFor(request.user);

  try {
    let { order_id } = request.params;

    let invoice = await Invoice.findOne({
      order: order_id
    })
    .populate('order')
    .populate({
      path: 'user',
      select: '-password -role -token'
    });

    let subjectInvoice = subject('Invoice', {...invoice, user_id: invoice.user._id});
    if(!policy.can('read', subjectInvoice)){
      return response.json({
        error: 1,
        message: 'forbidden'
      })
    }

    return response.json(invoice);
  } catch (error) {
    next(error);
  }
}

const initiatePayment = async (request, response, next) => {
  try {
    let { order_id } = request.params;
    let invoice = await Invoice
      .findOne({ order: order_id })
      .populate('order')
      .populate('user');
    
    if(!invoice) {
      return response.status(403).json({
        error: 1,
        message: 'Invoice not found'
      });
    }

    let params = {
      transaction_details: {
        order_id: String(invoice.order._id),
        gross_amount: invoice.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: invoice.user.full_name,
        email: invoice.user.email,
      }
    };

    let result = await snap.createTransaction(params);
    console.log(result);

    return response.status(200).json(result);

  } catch (error) {
    return response.status(500).json({
      error: 1,
      message: 'something wrong',
    });
  }
}

const handleMidtransNotification = async (request, response) => {
  try {
    const statusResponse = await snap.transaction.notification(request.body);
      
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        await Order.findOneAndUpdate(
          { _id: orderId },
          {
            status: 'paid'
          }
        );

        await Invoice.findOneAndUpdate(
          { order: orderId },
          { payment_status: 'paid'},
          { new: true }
        );

        return response.status(200).json('ok');
      }
    } else if (transactionStatus === 'settlement') {
      await Order.findOneAndUpdate(
        { _id: orderId },
        {
          status: 'processing'
        }
      );

      await Invoice.findOneAndUpdate(
        { order: orderId },
        { payment_status: 'paid'},
      );

      return response.status(200).json('ok');
    } else {
      return response.status(200).json('ok');
    }
  } catch (error) {
    return response.status(500).json('error');
  }
}

module.exports = {
  show, initiatePayment, handleMidtransNotification
}

