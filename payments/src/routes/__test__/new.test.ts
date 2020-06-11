import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@schregardus/common';
import { stripe } from '../../stripe';

it('has a route handler listening to /api/payments for post requests', async () => {
    const response = await request(app)
        .post('/api/payments')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/payments')
        .send({})
        .expect(401);
});

it('returns other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid token is provided', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: '',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(400);

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
          orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(400);
});

it('returns an error if an invalid order id is provided', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'some token',
    })
    .expect(400);

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'some token',
      orderId: 'some id'
    })
    .expect(400);

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'some token',
      orderId: mongoose.Types.ObjectId().toHexString()
    });

  expect(response.status).not.toEqual(400);
});

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asfasdf',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asfasdf',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'asfasdf',
      orderId: order.id
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa', // will always work for stripe accounts that are in the test mode
      orderId: order.id
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('aud');
});
