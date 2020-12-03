import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';

import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

const backend: String = 'http://localhost:3000';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  searchError: boolean = false;
  response: any = [];
  responseTime: any;
  queried: boolean = false;
  pending: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSearch(form: NgForm) {
    this.queried = false;
    if (form.value.searchString == '') {
      this.searchError = true;
      return;
    } else {
      this.pending = true;
      this.http
        .get(backend + '/db/query', {
          params: new HttpParams().set('string', form.value.searchString),
        })
        .subscribe((res) => {
          this.response = res;
          this.queried = true;
          this.pending = false;
        });
    }
  }
  // TODO: To retry connection every n seconds if query fails

  resultClick(targetID: String) {
    console.log('Clicked ' + targetID);
    window.open('/detail/' + targetID, '_blank');
    // this.router.navigateByUrl('/detail/' + targetID);
  }

  ngOnInit(): void {}
}
