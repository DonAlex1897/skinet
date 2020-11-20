import { IProduct } from './product';

export interface IPageination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
  }
