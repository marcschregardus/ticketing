import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@schregardus/common';
import { Order } from '../models/order';
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get('/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('OrderId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
