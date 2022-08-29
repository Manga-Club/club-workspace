import { BaseScan } from '@manga-club/scraper/base';
import { ComicsTypeEnum, IChapter, INewComic } from '@manga-club/shared/types';
import {
  clearText,
  info,
  success,
  toUniqueString,
  warn,
} from '@manga-club/shared/util';
import { debug } from '@manga-club/shared/util';

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

  async verifyCloudFlarePage() {
    const isCloudFlareBlock = await this.isCloudFlarePage();
    if (isCloudFlareBlock) {
      warn(`Blocked by CF page, refreshing the browser`);
      await this.refresh();
      return true;
    }
    return false;
  }

  async getAllComics(): Promise<INewComic[]> {
    const MAX_INTERACTIONS = 100;
    let interaction = 1;
    let hasNextPage = true;

    const allItems = [];
    do {
      await this.navigate(`${this.baseURL}/manga/page/${interaction}`, {
        waitUntil: 'networkidle0',
      });

      const wasRestarted = await this.verifyCloudFlarePage();
      if (wasRestarted) {
        continue;
      }

      info('Waiting page to load');
      await this.page.waitForSelector('.pages');

      info('Getting Comics');
      const pageItems = await this.getComicsFromCurrentPage();
      allItems.push(...pageItems);

      const lastPageNumber = await this.getLastPageNumber();

      hasNextPage = interaction < lastPageNumber;
      debug(`Interaction: ${interaction} - has more: ${hasNextPage}`);
      interaction++;
    } while (hasNextPage && interaction < MAX_INTERACTIONS);

    success(`Found ${allItems.length} comics`);

    const filteredData = allItems
      .map((item) => this.convertComic(item))
      .filter((item) => item.type && item.type !== ComicsTypeEnum.NOVEL);

    success(`Filtered ${filteredData.length} comics`);

    return filteredData;
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

  async getChapters(chapterPageUrl: string): Promise<IChapter[]> {
    await this.navigate(chapterPageUrl);

    const wasRestarted = await this.verifyCloudFlarePage();
    if (wasRestarted) {
      //continue;
    }

    const result = await this.page.evaluate(() => {
      const chapters = Array.from(
        document.querySelectorAll('li.wp-manga-chapter')
      );

      return chapters.map((chapter) => {
        const anchor = chapter.querySelectorAll('a')[1];
        const href: string = anchor.href;
        const chapterStr = anchor.textContent.match(/Cap\. \d*/g);

        return {
          number: parseInt(chapterStr[0].replaceAll(/\D/g, '')),
          url: href,
        };
      });
    });

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
            image.getAttribute('data-src').replace(/\t/g, '').replace(/\n/g, '')
        );
      });
    } catch (err) {
      await this.page.screenshot({ path: `img_${chapter.number}.png` });
      console.log(err);
    }
  }

  private getLastPageNumber = async () =>
    await this.page.evaluate(() => {
      const pages = document.querySelector('.pages');
      const slices = pages.textContent.split(' ');
      const lastSlice = slices[slices.length - 1];
      return Number(lastSlice);
    });

  private getComicsFromCurrentPage = async () =>
    await this.page.evaluate(() => {
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
}
