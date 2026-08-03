import { IPasswordHasher } from '../interfaces/password-hasher.interface';
export class HashedPassword {
  private constructor(
    private readonly value: string,
    private readonly isHashed: boolean,
  ) {}

  public static createFromPlain(plainText: string): HashedPassword {
    if (!plainText) throw new Error('Password is required');
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!regex.test(plainText)) {
      throw new Error(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
      );
    }
    return new HashedPassword(plainText, false);
  }

  public static createFromHash(hashedText: string): HashedPassword {
    if (!hashedText) throw new Error('Hashed password is required');
    return new HashedPassword(hashedText, true);
  }

  public async toHash(hasher: IPasswordHasher): Promise<HashedPassword> {
    if (this.isHashed) return this;
    const hash = await hasher.hash(this.value);
    return new HashedPassword(hash, true);
  }

  public async compare(
    plainText: string,
    hasher: IPasswordHasher,
  ): Promise<boolean> {
    if (!this.isHashed) {
      throw new Error(
        'Cannot compare a plain text password. It must be hashed first.',
      );
    }
    // 🌟 Thêm await vào đây để đồng bộ với từ khóa async của hàm
    return await hasher.compare(plainText, this.value);
  }

  public getValue() {
    return this.value;
  }
}
