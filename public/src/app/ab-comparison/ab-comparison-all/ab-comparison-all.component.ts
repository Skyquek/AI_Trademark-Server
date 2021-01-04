import { Component, OnInit } from '@angular/core';

import { AbResultWs } from 'models/ab-result';
import { AbSocketService } from 'services/ab-socket.service';

@Component({
  selector: 'app-ab-comparison-all',
  templateUrl: './ab-comparison-all.component.html',
  styleUrls: ['./ab-comparison-all.component.scss'],
})
export class AbComparisonAllComponent implements OnInit {
  resultList: Array<AbResultWs> = [];
  failList: Array<AbResultWs> = [];
  totalResultCount: number = -1;
  queried: boolean = false;

  newMessage: string = '';

  constructor(private abService: AbSocketService) {
    abService.abResult.subscribe((result: AbResultWs) => {
      console.log(result);
      this.resultList.push(result);
      console.log(this.resultList);
    });

    abService.abFail.subscribe((result: any) => {
      this.failList.push(result);
    });

    // Updates the total result count to that returned by the database
    abService.abResultCount.subscribe((count: number) => {
      this.totalResultCount = count;
    });
  }

  sendMessage() {
    this.queried = true;
    this.abService.sendMessage(this.newMessage.valueOf());
    console.log('Sending ' + this.newMessage.valueOf() + ' for comparison');
  }

  ngOnInit() {}
}
