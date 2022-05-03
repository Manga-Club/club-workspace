import { INewComic } from '@manga-club/shared/types';
import { Logger } from '@nestjs/common';
import { prisma } from './prisma';

export const createComicMany = async (comics: INewComic[]) => {
  for (let i = 0; i < comics.length; i++) {
    const current = comics[i];
    Logger.log(`Creating Comic: ${current.name}`);
    await prisma.comic.create({
      data: {
        name: current.uniqueName,
        type: current.type,
        uniqueNames: {
          create: {
            name: current.uniqueName,
            source: 'NEOXSCANS',
          },
        },
      },
    });
  }
};
