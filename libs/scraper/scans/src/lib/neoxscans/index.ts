import * as Puppeteer from 'puppeteer';
import { BaseScan } from '@manga-club/scraper/base';
import { IChapter } from '@manga-club/shared/types';

export class Neoxscans extends BaseScan {
  constructor(url: string) {
    super();
    this.homeUrl = url;
  }

  homeUrl: string;

  getCoverPhoto: () => string;
  async getChapters(): Promise<IChapter[]> {
    const page = this.getPage();
    await page.goto(this.homeUrl);
    // await page.waitForNavigation();
    const result = await page.evaluate(() => {
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
      await page.screenshot({ path: `chapters.png` });
    }

    return result;
  }

  async getChapterImages(chapter: IChapter) {
    const page = this.getPage();
    try {
      await page.goto(chapter.url);
      // await wait(2000);

      return await page.evaluate(() => {
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
      await page.screenshot({ path: `img_${chapter.number}.png` });
      console.log(err);
    }
  }
}
