import {Publisher, Subjects, TicketCreatedEvent} from '@schregardus/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
