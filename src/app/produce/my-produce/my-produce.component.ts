import { Component, Input, OnInit } from '@angular/core';
import { ProduceModel } from 'src/app/models/produce-model';
import { ProduceService } from '../../services/produce.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-produce',
  templateUrl: './my-produce.component.html',
  styleUrls: ['./my-produce.component.css'],
})
export class MyProduceComponent implements OnInit {
  produces$: Array<ProduceModel>;

  constructor(private produceService: ProduceService, private router: Router) {}

  ngOnInit(): void {
    this.getProducesbyUser();
  }

  // //function to get all produces
  // getProduces() {
  //   this.produceService.getAllProduces().subscribe((produce) => {
  //     console.log(produce);
  //     this.produces$ = produce;
  //   });
  // }

  //function to get all produces
  getProducesbyUser() {
    this.produceService.getProducebyUser().subscribe((produce) => {
      console.log(produce);
      this.produces$ = produce;
    });
  }
}
