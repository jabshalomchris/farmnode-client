import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Request } from 'src/app/models/request-model';
import { RequestService } from '../../services/request.service';
import { RequestResponsePayload } from '../request-response.payload';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css'],
})
export class ViewRequestComponent implements OnInit {
  requestId;
  request: Request = new Request();
  requestItems;
  requestForm: FormGroup;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _requestService: RequestService
  ) {}

  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('requestId');
    if (isIdPresent) {
      this.requestId = Number(
        this._activatedRoute.snapshot.paramMap.get('requestId')
      );
      this.getRequestbyId();
    }
  }

  getRequestbyId() {
    this._requestService.getRequestById(this.requestId).subscribe((data) => {
      this.request = data;
      this.requestItems = data.requestItem;
      console.log(this.request);
    });
  }
}
