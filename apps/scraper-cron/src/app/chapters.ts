import { Neoxscans } from '@manga-club/scraper/scans';
//import { Logger } from '@nestjs/common';

const scan = new Neoxscans();

export const getAllChapters = async () => {
  //Logger.log('- Before Init');
  await scan.init();
  //Logger.log('- Initialized');
  // wait(2000);
  const chapters: any = await scan.getChapters();
  //Logger.log('- Chapters: ', JSON.stringify(chapters));
  await scan.close();

  //Logger.log('- Closed');

  //   for (let i = 0; i < chapters.length; i++) {
  //     wait(2000);
  //     const current = chapters[i];
  //     const images = await scan.getChapterImages(current);
  //     console.log(images);
  //     current.images = images;
  //   }

  //   fs.writeFile('db.json', JSON.stringify(chapters), function (err) {
  //     if (err) throw err;
  //     console.log('complete');
  //   });
};
