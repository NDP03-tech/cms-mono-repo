// shared/domain/base.entity.ts
export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  // Thằng Cha xây sẵn một cái khung Constructor đón nhận 3 biến
  constructor(id: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
