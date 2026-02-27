export class BoxCreatedEvent {
  constructor(
    public readonly boxId: number,
    public readonly warehouseId: number,
    public readonly size: string,
    public readonly priceMonthly: number,
    public readonly actorId?: string,
  ) {}
}

export class BoxPriceChangedEvent {
  constructor(
    public readonly boxId: number,
    public readonly warehouseId: number,
    public readonly oldPrice: number,
    public readonly newPrice: number,
    public readonly actorId?: string,
  ) {}
}
