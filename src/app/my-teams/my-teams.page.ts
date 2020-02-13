import { UserSettings } from './../services/user-settings.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { EliteApi } from '../services/elite-api.service';

@Component({
  selector: 'app-my-teams',
  templateUrl: 'my-teams.page.html',
  styleUrls: ['my-teams.page.scss'],
})
export class MyTeamsPage implements OnInit {
  favorites = [];
  constructor(
    private router: Router, private eliteApi: EliteApi, private loadingController: LoadingController,
    private userSettings: UserSettings ) {}

  gotoTournaments() {
      this.router.navigate(['tournaments']);
  }

  ngOnInit() {
    }

 ionViewWillEnter() {
  this.favorites = this.userSettings.getAllFavorites();
}
  async favoriteTapped($event, favorite) {
     const loader = await this.loadingController.create({
      message: 'Getting data...'
    });
     loader.present().then(() => {
      this.eliteApi.getTournamentData(favorite.tournamentId).subscribe(t => {
      const navigationExtras: NavigationExtras = { state: { data: favorite.team}};
      this.router.navigate(['team-home'], navigationExtras);
      loader.dismiss();
       });
    });
  }
}
