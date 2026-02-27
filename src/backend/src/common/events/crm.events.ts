export class LeadCreatedEvent {
  constructor(
    public readonly leadId: number,
    public readonly name: string,
    public readonly phone: string,
    public readonly email: string | undefined,
    public readonly source: string | undefined,
    public readonly actorId?: string,
  ) {}
}

export class LeadStatusChangedEvent {
  constructor(
    public readonly leadId: number,
    public readonly fromStatus: string | null,
    public readonly toStatus: string,
    public readonly reason: string | undefined,
    public readonly actorId?: string,
  ) {}
}
