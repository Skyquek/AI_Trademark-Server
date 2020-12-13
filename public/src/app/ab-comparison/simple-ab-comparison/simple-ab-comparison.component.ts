import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AbCompareService } from 'services/ab-compare.service';
import { AbResult } from 'models/ab-result';

@Component({
  selector: 'app-simple-ab-comparison',
  templateUrl: './simple-ab-comparison.component.html',
  styleUrls: ['./simple-ab-comparison.component.scss'],
})
export class SimpleAbComparisonComponent implements OnInit {
  searchErrorA: boolean = false;
  searchErrorB: boolean = false;
  response: any;
  queried: boolean = false;
  pending: boolean = false;

  constructor(private abCompareService: AbCompareService) {}

  onSubmit(form: NgForm) {
    this.queried = false;
    this.pending = true;

    this.abCompareService
      .compare(form.value.stringA, form.value.stringB)
      .subscribe((res: AbResult) => {
        this.response = res;
        this.queried = true;
        this.pending = false;
        console.log(res);
        console.log(this.response);
      });
  }

  ngOnInit(): void {}
}
