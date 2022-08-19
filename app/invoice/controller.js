const Invoice = require('./model');
const policyFor = require('../policy');
const { subject } = require('@casl/ability');

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

module.exports = {
  show
}

