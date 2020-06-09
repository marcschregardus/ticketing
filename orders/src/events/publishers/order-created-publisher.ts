import { OrderCreatedEvent, Publisher, Subjects } from '@schregardus/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
