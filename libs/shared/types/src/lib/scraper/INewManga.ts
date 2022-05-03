export enum ComicsTypeEnum {
  MANGA = 0,
  MANHWA = 1,
  MANHUWA = 2,
  NOVEL = 3,
}

export interface INewComic {
  name: string;
  uniqueName: string;
  type?: ComicsTypeEnum;
  coverURL?: string;
  url: string;
}
