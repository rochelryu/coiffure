import { ALPHABET } from '../Constants/constants';
import * as fs from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';
const logger: Logger = new Logger('Utils');

export function assetFile(directory: string): string {
  return join(`${__dirname}/../../../static/assets/`, directory);
}

export async function createFileWithBuffer(directory: string, base64: string) {
  if (!fs.existsSync(assetFile(directory))) {
    const buff = Buffer.from(base64, 'base64');
    fs.writeFileSync(assetFile(directory), buff);
  } else {
    logger.error(assetFile(directory) + ' already exist');
  }
}
export async function generateRecoveryForHelp(): Promise<string> {
  const ALPHABET_ARRAY = ALPHABET.split('');
  const recovery = [0, 0, 0, 0, 0, 0, 0, 0]
    .map(() => ALPHABET[Math.floor(Math.random() * ALPHABET_ARRAY.length - 1)])
    .join('');
  return new Promise((next) => next(recovery.trim()));
}
