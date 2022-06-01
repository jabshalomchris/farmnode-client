import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { RequestResponsePayload } from '../request-response.payload';

@Component({
  selector: 'app-view-recieved-request',
  templateUrl: './view-recieved-request.component.html',
  styleUrls: ['./view-recieved-request.component.css'],
})
export class ViewRecievedRequestComponent implements OnInit {
  requests$: Array<RequestResponsePayload>;
  constructor(private _requestService: RequestService) {}

  ngOnInit(): void {
    this.getInboundRequestsbyUser();
  }

  //function to get all produces
  getInboundRequestsbyUser() {
    this._requestService.getRequestsAsGrower().subscribe((data) => {
      console.log(data);
      this.requests$ = data;
    });
  }
}
