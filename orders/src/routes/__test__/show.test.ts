import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket'

it('has a route handler listening to /api/orders/:orderId for post requests', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const response = await request(app)
    .get(`/api/orders/${ticketId}`);

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .get(`/api/orders/${ticketId}`)
    .expect(401);
});

it('returns other than 401 if the user is signed in', async () => {
  const ticketId = mongoose.Types.ObjectId();
  const response = await request(app)
    .get(`/api/orders/${ticketId}`)
    .set('Cookie', global.signin());

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid order id is provided', async () => {
  await request(app)
    .get('/api/orders/ABC123')
    .set('Cookie', global.signin())
    .expect(400);
});

it('returns a 404 if the order doesnt exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .get(`/api/orders/${ticketId}`)
    .set('Cookie', global.signin())
    .expect(404);
});

it('fetches the order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order
  let { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
