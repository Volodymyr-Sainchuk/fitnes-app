import * as paymentService from "../services/paymentService.js";

export async function createSession(req, res, next) {
  try {
    const result = await paymentService.createPaymentSession(req.user.id, req.body.membershipId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
