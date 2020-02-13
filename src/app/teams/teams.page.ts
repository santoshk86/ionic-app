import { Router, NavigationExtras, ActivatedRoute, PreloadAllModules } from '@angular/router';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { EliteApi } from './../services/elite-api.service';
import { LoadingController } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss']
})
export class TeamsPage implements OnInit {
  public selectedTourney: any = {};
  public teams = [];
  private allTeams: any;
  private allTeamDivisions: any;
  public queryText: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eliteApi: EliteApi,
    private loadingController: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.selectedTourney = this.router.getCurrentNavigation().extras.state.data;
      }
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    const loader = await this.loadingController.create({
      message: 'Getting teams...'
    });

    loader.present().then(() => {
      this.eliteApi
        .getTournamentData(this.selectedTourney.id)
        .subscribe(data => {
          this.allTeams = data.teams;
          // tslint:disable-next-line: max-line-length
          this.allTeamDivisions = _.chain(data.teams).groupBy('division').toPairs().map(item => _.zipObject(['divisionName', 'divisionTeams'], item )).value();

          this.teams = this.allTeamDivisions;
          loader.dismiss();
        });
    });
  }

  itemTapped($event, team) {
    const navigationExtras: NavigationExtras = { state: { data: team } };
    this.router.navigate(['team-home'], navigationExtras);
  }

  updateTeams() {
    const queryTextLower = this.queryText.toLowerCase();
    const filteredTeams = [];
    _.forEach(this.allTeamDivisions, td => {
      const teams = _.filter(td.divisionTeams, t => (t as any).name.toLowerCase().includes(queryTextLower));
      if (teams.length) {
        filteredTeams.push({divisionName: td.divisionName, divisionTeams: teams});
      }
    });
    this.teams = filteredTeams;
  }
}
