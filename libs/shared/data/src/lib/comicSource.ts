import { prisma } from './prisma';

export const getAllComicSource = async () => prisma.comicSource.findMany();
