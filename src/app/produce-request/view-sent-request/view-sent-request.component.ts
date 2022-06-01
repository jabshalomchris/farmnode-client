import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { RequestResponsePayload } from '../request-response.payload';

@Component({
  selector: 'app-view-sent-request',
  templateUrl: './view-sent-request.component.html',
  styleUrls: ['./view-sent-request.component.css'],
})
export class ViewSentRequestComponent implements OnInit {
  requests$: Array<RequestResponsePayload>;

  constructor(private _requestService: RequestService) {}

  ngOnInit(): void {
    this.getOutboundRequestsbyUser();
  }

  //function to get all produces
  getOutboundRequestsbyUser() {
    this._requestService.getRequestsAsBuyer().subscribe((data) => {
      console.log(data);
      this.requests$ = data;
    });
  }
}
