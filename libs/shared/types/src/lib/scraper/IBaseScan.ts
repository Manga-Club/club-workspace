import { IChapter } from './IChapter';

export interface IBaseScan {
  init: () => void;
  close: () => void;
}
