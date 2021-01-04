import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SimpleSearchService } from 'services/simple-search.service';
import { SimpleSearchResult } from 'models/simple-search-result';
import { Trademark } from 'models/trademark';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  searchError: boolean = false;
  queried: boolean = false;
  pending: boolean = false;
  response: any;

  constructor(
    private simpleSearchService: SimpleSearchService,
    private router: Router
  ) {}

  onSearch(form: NgForm) {
    this.queried = false;
    if (form.value.searchString == '') {
      this.searchError = true;
      return;
    } else {
      this.pending = true;
      this.searchError = false;
      this.simpleSearchService
        .search(form.value.searchString)
        .subscribe((result: SimpleSearchResult) => {
          this.response = result;
          this.queried = true;
          this.pending = false;
        });
    }
  }
  // TODO: To retry connection every n seconds if query fails

  resultClick(targetID: string) {
    console.log('Clicked ' + targetID);
    window.open('/detail/' + targetID, '_blank');
    // this.router.navigateByUrl('/detail/' + targetID);
  }

  randomTrademark() {
    this.simpleSearchService
      .getRandomTrademark()
      .subscribe((trademark: Trademark) => {
        this.router.navigate(['detail', trademark.number]);
      });
  }

  ngOnInit(): void {}
}
