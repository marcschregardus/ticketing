import {Publisher, Subjects, TicketUpdatedEvent} from '@schregardus/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
