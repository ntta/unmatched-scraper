import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

export const FILENAMES = fs.readdirSync('./json/game-sets');
export const NOT_TO_DO_FILENAMES = ['houdini-vs-the-genie.json'];
export const PRISMA = new PrismaClient();
