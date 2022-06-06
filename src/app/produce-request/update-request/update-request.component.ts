import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { Request } from 'src/app/models/request-model';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.css'],
})
export class UpdateRequestComponent implements OnInit {
  requestId;
  request: Request = new Request();
  requestItems;
  requestForm: FormGroup;
  confirmationString: String;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _requestService: RequestService,
    private toastr: ToastrService
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
    });
  }

  getUserdetails() {}

  updateRequestStatus(requestId, status) {
    {
      if (status == 'APPROVED') {
        this.confirmationString = 'accept';
      } else {
        this.confirmationString = 'decline';
      }
      Swal.fire({
        title:
          'Are you sure want to ' + this.confirmationString + ' the request ?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#8EB540',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this._requestService.editStatus(requestId, status).subscribe(
            (data) => {
              this.toastr.info('Request ' + status + "' d !");
              this.getRequestbyId();
            },
            (error) => {
              throwError(error);
              this.toastr.error('Error during updating produce');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', '', 'error');
        }
      });
    }
  }
}
