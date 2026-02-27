export class MediaUploadedEvent {
  constructor(
    public readonly mediaId: number,
    public readonly warehouseId: number,
    public readonly fileUrl: string,
    public readonly fileType: string,
    public readonly actorId?: string,
  ) {}
}

export class MediaDeletedEvent {
  constructor(
    public readonly mediaId: number,
    public readonly warehouseId: number,
    public readonly fileUrl: string,
    public readonly actorId?: string,
  ) {}
}
