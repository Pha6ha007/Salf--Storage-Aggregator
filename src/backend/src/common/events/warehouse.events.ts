export class WarehouseCreatedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly operatorId: number,
    public readonly name: string,
    public readonly emirate: string,
    public readonly actorId?: string,
  ) {}
}

export class WarehouseUpdatedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly operatorId: number,
    public readonly changes: Record<string, any>,
    public readonly actorId?: string,
  ) {}
}

export class WarehouseStatusChangedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly operatorId: number,
    public readonly fromStatus: string,
    public readonly toStatus: string,
    public readonly actorId?: string,
  ) {}
}
