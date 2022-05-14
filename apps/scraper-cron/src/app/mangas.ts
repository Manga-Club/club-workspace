import { Neoxscans } from '@manga-club/scraper/scans';
import { createComicMany, getAllComicSource } from '@manga-club/shared/data';
import { differenceWith } from 'lodash';
import { debug, error, success } from '@manga-club/shared/util';
import { environment } from '../environments/environment';

export const verifyComics = async () => {
  try {
    debug('Verify Comics - INIT');
    //const uniqueNamesPromise = getAllComicSource();

    const scan = new Neoxscans();
    await scan.init(true);
    const getAllComicsPromise = scan.getAllComics();

    //const uniqueNames = await uniqueNamesPromise;
    const allComics = await getAllComicsPromise;
    await scan.close();

    success(`Found ${allComics.length} new comics`);
    // const newComics = differenceWith(
    //   allComics,
    //   uniqueNames,
    //   (a, b) => a.name !== b.uniqueName
    // );

    // success(`Found ${newComics.length} new comics`);

    // await createComicMany(newComics);
  } catch (e) {
    error(`Failed to verify comics`, e.message);
  }
};
