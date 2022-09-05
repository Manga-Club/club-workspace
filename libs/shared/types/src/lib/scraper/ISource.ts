import { IChapter } from './IChapter';
import { INewComic } from './INewManga';

export interface ISource {
  /**
   * Pass throught all comic pages and get all comics in there
   */
  getAllComics(): Promise<INewComic[]>;

  /**
   * Navigate to the chapter url, and get all chapters in there
   * @param chapterPageUrl The chapter URL
   */
  getChapters(chapterPageUrl: string): Promise<IChapter[]>;
}
