import {PaymentCreatedEvent, Publisher, Subjects} from '@schregardus/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
