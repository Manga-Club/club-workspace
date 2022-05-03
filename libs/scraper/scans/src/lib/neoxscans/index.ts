import { BaseScan } from '@manga-club/scraper/base';
import { ComicsTypeEnum, IChapter, INewComic } from '@manga-club/shared/types';
import { clearText, toUniqueString, wait } from '@manga-club/shared/util';

interface IScrapedComic {
  name: string;
  type?: string;
  url: string;
}
export class Neoxscans extends BaseScan {
  constructor() {
    super();
  }

  baseURL = 'https://neoxscans.net';

  async getAllComics(): Promise<INewComic[]> {
    await this.navigate(`${this.baseURL}/home/manga`);
    const MAX_INTERACTIONS = 100;
    let interaction = 0;
    let isLoadMoreVisible = true;
    do {
      this.log('Loading more...');
      await wait(300);
      await this.page.click('#navigation-ajax');
      this.log('Wait Loading...');
      await this.waitForAllRequests();
      // await this.page.waitForFunction(
      //   () => !document.querySelector('.show-loading')
      // );
      isLoadMoreVisible = await this.page.evaluate(() => {
        const nav = document.querySelector('.navigation-ajax');
        return !nav.getAttribute('style');
      });
      this.log(`Has More: ${isLoadMoreVisible}`);
      interaction++;
    } while (isLoadMoreVisible && interaction < MAX_INTERACTIONS);

    this.log('Getting Comics');
    const allItems = await this.page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.page-item-detail'));
      return items.map((item) => {
        const anchor = item.querySelector<HTMLAnchorElement>('h3 a');
        const typeEl = item.querySelector('.manga-title-badges');
        return {
          name: anchor?.textContent,
          type: typeEl?.textContent,
          url: anchor?.href?.trim(),
        };
      });
    });

    this.log('Filtering data');

    return allItems
      .map((item) => this.convertComic(item))
      .filter((item) => item.type && item.type !== ComicsTypeEnum.NOVEL);
  }

  private convertComic(comic: IScrapedComic): INewComic {
    return {
      name: clearText(comic.name),
      uniqueName: toUniqueString(comic.name),
      type: comic.type && ComicsTypeEnum[clearText(comic.type).toUpperCase()],
      url: comic.url,
    };
  }

  getCoverPhoto: () => string;
  async getChapters(): Promise<IChapter[]> {
    await this.page.goto(this.baseURL);
    // await page.waitForNavigation();
    const result = await this.page.evaluate(() => {
      const chapters = Array.from(
        document.querySelectorAll('li.wp-manga-chapter')
      );

      return chapters.map((chapter) => {
        const anchor = chapter.querySelector('a');
        const href: string = anchor.href;
        return {
          number: parseInt(anchor.textContent.replace(/\D/g, '')),
          url: href,
        };
      });
    });

    if (result.length === 0) {
      await this.page.screenshot({ path: `chapters.png` });
      const data = await this.page.evaluate(
        () => document.querySelector('*').outerHTML
      );
      console.log(data);
    }

    return result;
  }

  async getChapterImages(chapter: IChapter) {
    try {
      await this.page.goto(chapter.url);
      // await wait(2000);

      return await this.page.evaluate(() => {
        const images: HTMLImageElement[] = Array.from(
          document.querySelectorAll('.reading-content img')
        );
        return images.map(
          (image) =>
            image.src ||
            image
              .getAttribute('data-src')
              .replaceAll('\t', '')
              .replaceAll('\n', '')
        );
      });
    } catch (err) {
      await this.page.screenshot({ path: `img_${chapter.number}.png` });
      console.log(err);
    }
  }
}
