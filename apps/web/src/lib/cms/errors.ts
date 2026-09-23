export class CmsError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'CmsError';
    this.status = status;
  }
}
