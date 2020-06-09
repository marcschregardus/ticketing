import { OrderCancelledEvent, Publisher, Subjects } from '@schregardus/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
