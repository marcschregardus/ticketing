import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@schregardus/common';
import { Order } from '../models/order';
import mongoose from "mongoose";
import { stripe } from '../stripe';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('The token is required'),
    body('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('The order id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    await stripe.charges.create({
      currency: 'aud',
      amount: order.price * 100, // convert to cents
      source: token,
    });

    res.status(201).send({ success: true });
});

export { router as createChargeRouter };
