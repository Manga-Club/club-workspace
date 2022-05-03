import { Neoxscans } from '@manga-club/scraper/scans';
import { Logger } from '@nestjs/common';
import { createComicMany, getAllComicSource } from '@manga-club/shared/data';
import { differenceWith } from 'lodash';
import { environment } from '../environments/environment';

export const verifyComics = async () => {
  try {
    Logger.log('verifyComics - init');
    const uniqueNamesPromise = getAllComicSource();

    const scan = new Neoxscans();
    await scan.init(environment.production);
    const getAllComicsPromise = scan.getAllComics();

    const uniqueNames = await uniqueNamesPromise;
    const allComics = await getAllComicsPromise;
    await scan.close();

    const newComics = differenceWith(
      allComics,
      uniqueNames,
      (a, b) => a.name !== b.uniqueName
    );

    Logger.log(`Found ${newComics.length} new comics`);

    await createComicMany(newComics);
  } catch (e) {
    Logger.error(`Failed to verify comics`, e.message);
  }
};
