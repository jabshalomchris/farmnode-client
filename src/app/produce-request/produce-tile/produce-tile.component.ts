import { Component, Input, OnInit } from '@angular/core';
import { MessengerService } from 'src/app/services/messenger.service';
import { ProduceModel } from '../../models/produce-model';

@Component({
  selector: 'app-produce-tile',
  templateUrl: './produce-tile.component.html',
  styleUrls: ['./produce-tile.component.css'],
})
export class ProduceTileComponent implements OnInit {
  @Input() productItem: ProduceModel;

  constructor(private msg: MessengerService) {}

  ngOnInit(): void {}

  handleAddToRequest() {
    this.msg.sendMsg(this.productItem);
  }
}
