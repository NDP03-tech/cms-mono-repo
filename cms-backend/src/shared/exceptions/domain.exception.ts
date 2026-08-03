export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class BusinessRuleException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleException';
  }
}
