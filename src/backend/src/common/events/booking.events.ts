export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: number,
    public readonly userId: string,
    public readonly warehouseId: number,
    public readonly boxId: number,
    public readonly priceTotal: number,
    public readonly actorId?: string,
  ) {}
}

export class BookingConfirmedEvent {
  constructor(
    public readonly bookingId: number,
    public readonly userId: string,
    public readonly warehouseId: number,
    public readonly operatorId: number,
    public readonly actorId?: string,
  ) {}
}

export class BookingCancelledEvent {
  constructor(
    public readonly bookingId: number,
    public readonly userId: string,
    public readonly warehouseId: number,
    public readonly cancelledBy: 'user' | 'operator' | 'system',
    public readonly cancelReason?: string,
    public readonly actorId?: string,
  ) {}
}

export class BookingCompletedEvent {
  constructor(
    public readonly bookingId: number,
    public readonly userId: string,
    public readonly warehouseId: number,
    public readonly operatorId: number,
    public readonly actorId?: string,
  ) {}
}

export class BookingExpiredEvent {
  constructor(
    public readonly bookingId: number,
    public readonly userId: string,
    public readonly warehouseId: number,
  ) {}
}
