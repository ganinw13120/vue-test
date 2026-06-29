export class ProductNotFoundError extends Error {
  constructor(id: number) {
    super(`Product '${id}' was not found.`);
    this.name = ProductNotFoundError.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}