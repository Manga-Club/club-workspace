import { Neoxscans } from '@manga-club/scraper/scans';
import { Logger } from '@nestjs/common';
import { environment } from '../environments/environment';
import {
  createComicMany,
  getAllComicUniqueNames,
} from '@manga-club/shared/data';
import { differenceWith } from 'lodash';

export const verifyComics = async () => {
  try {
    Logger.log('verifyComics - init');
    const uniqueNamesPromise = await getAllComicUniqueNames();

    const scan = new Neoxscans();
    await scan.init(!environment.production);
    const getAllComicsPromise = scan.getAllComics();

    const uniqueNames = await uniqueNamesPromise;
    const allComics = await getAllComicsPromise;
    await scan.close();

    const newComics = differenceWith(
      allComics,
      uniqueNames,
      (a, b) => a.name !== b.name
    );

    Logger.log(`Found ${newComics.length} new comics`);

    await createComicMany(newComics);
  } catch (e) {
    Logger.error(`Failed to verify comics`, e.message);
  }
};
