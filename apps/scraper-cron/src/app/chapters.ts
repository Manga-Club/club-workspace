import { Neoxscans } from '@manga-club/scraper/scans';
import { debug, wait } from '@manga-club/shared/util';

const scan = new Neoxscans();

export const getAllChapters = async (chapterUrl: string) => {
  debug('Before Init');
  await scan.init();
  wait(2000);
  const chapters = await scan.getChapters(chapterUrl);

  debug(`Found ${chapters.length} chapters`);
  debug(JSON.stringify(chapters));

  await scan.close();

  // for (let i = 0; i < chapters.length; i++) {
  //   wait(2000);
  //   const current = chapters[i];
  //   const images = await scan.getChapterImages(current);
  //   console.log(images);
  //   current.images = images;
  // }

  // fs.writeFile('db.json', JSON.stringify(chapters), function (err) {
  //   if (err) throw err;
  //   console.log('complete');
  // });
};
