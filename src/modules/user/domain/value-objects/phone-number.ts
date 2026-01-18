import { ArgumentInvalidException } from '@/libs/exceptions/exceptions';

export class PhoneNumber {
  private readonly value: string;
  private readonly phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

  constructor(phoneString: string) {
    const isValid = this.validate(phoneString);
    if (!isValid) {
      throw new ArgumentInvalidException('Invalid phone number');
    }
    this.value = phoneString;
  }

  public getValue() {
    return this.value;
  }

  private validate(phone: string) {
    return this.phoneRegex.test(phone);
  }
}
