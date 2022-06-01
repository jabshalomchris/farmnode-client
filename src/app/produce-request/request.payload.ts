import { RequestItem } from '../models/request-item-model';
export interface ProduceRequestPayload {
  requestStatus: string;
  requestItem: any;
  growerId: string;
  message: string;
}
