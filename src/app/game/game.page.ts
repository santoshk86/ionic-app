import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { EliteApi } from '../services/elite-api.service';
import { LoadingController } from '@ionic/angular';
import * as _ from 'lodash';
declare var window: any;
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  public game: any = {};
  public teams = [];
  public location: any = {};
  constructor(
    private route: ActivatedRoute, private router: Router, private eliteApi: EliteApi, private loadingController: LoadingController) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.game = this.router.getCurrentNavigation().extras.state.data;
          this.game.gameTime = Date.parse(this.game.time);
        }
      });
     }

  ngOnInit() {
  }

  async teamTapped(teamId) {
    const loader = await this.loadingController.create({
      message: 'Getting teams...'
    });

    loader.present().then(() => {
      this.eliteApi.getCurrentTourney().subscribe(data => {
          this.teams = data.teams;
          const team = this.teams.find(g => g.id === teamId);

          const navigationExtras: NavigationExtras = { state: { data: team }};
          this.router.navigate(['team-home'], navigationExtras);

          loader.dismiss();
        });
      });
  }

  goToDirections() {
    this.eliteApi.getCurrentTourney().subscribe(data => { this.location = data.locations[this.game.locationId]; });
    window.location = `geo:${this.location.latitude},${this.location.longitude};u=35;`;
    console.log('latitude', this.location.latitude);
  }

  goToMap() {
    const navigationExtras: NavigationExtras = { state: { data: this.game }};
    this.router.navigate(['map'], navigationExtras);
  }

  isWinner(score1, score2){
    return Number(score1) > Number(score2) ? 'primary' : 'danger';
  }
}
