import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { JsonGameSet } from './types';

export const FILENAMES = fs.readdirSync('./json/game-sets');
export const PRISMA = new PrismaClient();
export const JSON_GAME_SETS: JsonGameSet[] = JSON.parse(
  fs.readFileSync(`./json/sets.json`).toString()
)['sets'];
