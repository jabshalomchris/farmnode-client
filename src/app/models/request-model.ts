import { RequestItem } from './request-item-model';

export class Request {
  requestId: number;
  growerId: number;
  growerName: string;
  buyerId: number;
  buyerName: string;
  requestStatus: string;
  message: string;
  createdDate: string;
  requestItem: Array<RequestItem>;
}
