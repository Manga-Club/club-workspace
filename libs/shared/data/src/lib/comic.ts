import { INewComic } from '@manga-club/shared/types';
import { debug } from '@manga-club/shared/util';
import { prisma } from './prisma';

export const createComicMany = async (comics: INewComic[]) => {
  for (let i = 0; i < comics.length; i++) {
    const current = comics[i];
    debug(`Creating Comic: ${current.name}`);
    await prisma.comic.create({
      data: {
        name: current.uniqueName,
        type: current.type,
        uniqueNames: {
          create: {
            uniqueName: current.uniqueName,
            source: 'NEOXSCANS',
            url: current.url,
          },
        },
      },
    });
  }
};
