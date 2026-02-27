export class ReviewCreatedEvent {
  constructor(
    public readonly reviewId: number,
    public readonly userId: string,
    public readonly warehouseId: number,
    public readonly bookingId: number | null,
    public readonly rating: number,
    public readonly actorId?: string,
  ) {}
}
