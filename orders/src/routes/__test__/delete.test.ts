import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/orders/:orderId for post requests', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const response = await request(app)
    .delete(`/api/orders/${ticketId}`)
    .send();

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .delete(`/api/orders/${ticketId}`)
    .send()
    .expect(401);
});

it('returns other than 401 if the user is signed in', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const response = await request(app)
    .delete(`/api/orders/${ticketId}`)
    .set('Cookie', global.signin())
    .send();

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid order id is provided', async () => {
  await request(app)
    .delete('/api/orders/ABC123')
    .set('Cookie', global.signin())
    .send()
    .expect(400);
});

it('returns a 404 if the order doesnt exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .delete(`/api/orders/${ticketId}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});

it('marks an order as cancelled', async () => {
  // Create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // Expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
