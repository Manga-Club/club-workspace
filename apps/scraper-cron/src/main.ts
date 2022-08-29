import { getAllChapters } from './app/chapters';
import { verifyComics } from './app/comics';

(async () => {
  //await verifyComics();
  await getAllChapters(
    'https://neoxscans.net/manga/the-world-after-the-end-novel/'
  );
})();
