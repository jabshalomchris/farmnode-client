import { RequestItem } from '../models/request-item-model';

export interface RequestResponsePayload {
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
