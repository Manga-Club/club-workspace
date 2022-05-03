import { prisma } from './prisma';

export const getAllComicUniqueNames = async () =>
  prisma.comicUniqueName.findMany();
