import { ExpirationCompleteEvent, Publisher, Subjects } from '@schregardus/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
