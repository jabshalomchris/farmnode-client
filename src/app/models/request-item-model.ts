import { ProduceModel } from './produce-model';
export class RequestItem {
  produceId: number;
  produceName: string;
  quantity: number;
  price: number;
  linetotal: number;

  constructor(produce: ProduceModel, quantity = 1) {
    this.produceId = produce.produceId;
    this.produceName = produce.produceName;
    this.price = produce.price;
    this.quantity = quantity;
    this.linetotal = produce.price * quantity;
  }
}
