export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly role: string,
  ) {}
}

export class UserSearchedEvent {
  constructor(
    public readonly userId: string | undefined,
    public readonly searchQuery: any,
    public readonly resultsCount: number,
    public readonly sessionId?: string,
  ) {}
}

export class WarehouseViewedEvent {
  constructor(
    public readonly warehouseId: number,
    public readonly userId: string | undefined,
    public readonly source: 'search' | 'direct' | 'favorites',
    public readonly sessionId?: string,
  ) {}
}
