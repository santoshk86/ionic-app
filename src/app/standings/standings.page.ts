import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { EliteApi } from './../services/elite-api.service';
import { LoadingController } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.page.html',
  styleUrls: ['./standings.page.scss'],
})
export class StandingsPage implements OnInit, OnDestroy {
  public allStandings: any[];
  public standings: any[];
  public team: any = {};
  public divisionFilter = 'division';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eliteApi: EliteApi,
    private loadingController: LoadingController) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.team = this.router.getCurrentNavigation().extras.state.data;
        }
      });
     }

  ngOnInit() {
  }


  async ionViewWillEnter() {
        const loader = await this.loadingController.create({
          message: 'Getting standings...'
        });
        loader.present().then(() => {
        this.eliteApi.getCurrentTourney().subscribe(data => {
        this.standings = data.standings;
        this.allStandings = data.standings;

        // this.allStandings = _.chain(this.standings).
        //                     groupBy('division').toPairs().map(item => _.zipObject(['divisionName', 'divisionStandings'], item)).value();
        this.filterDivision();
        loader.dismiss();
        });
      });
  }

  getHeader(record, recordIndex, records) {
      if (recordIndex === 0 || record.division !== records[recordIndex - 1].division ) {
        return record.division;
      } else {
        return null;
      }
  }

  filterDivision() {
    console.log(this.team);
    if (this.divisionFilter === 'all') {
      this.standings = this.allStandings;
    } else {
      this.standings = _.filter(this.allStandings, s => s.division === '3rd'); // TODO need to get right division here
    }
  }

  ngOnDestroy() {

   }
}
