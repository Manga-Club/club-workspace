export enum ComicsTypeEnum {
  MANGA = 'MANGA',
  MANHWA = 'MANHWA',
  MANHUWA = 'MANHUWA',
  NOVEL = 'NOVEL',
}

export interface INewComic {
  name: string;
  uniqueName: string;
  type?: ComicsTypeEnum;
  coverURL?: string;
  url: string;
}
