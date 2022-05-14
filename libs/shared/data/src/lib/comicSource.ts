import { prisma } from './prisma';

export const getAllComicSource = async () =>
  await prisma.comicSource.findMany();
