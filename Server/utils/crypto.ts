import { randomBytes } from 'crypto';
import { promisify } from 'util';

export const generateRandomToken = async (): Promise<string> => {
  const randomBytesPromise = promisify(randomBytes);
  const buffer = await randomBytesPromise(32);
  return buffer.toString('hex');
};