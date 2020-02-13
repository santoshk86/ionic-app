import { EliteApi } from './../services/elite-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss'],
})
export class TournamentsPage implements OnInit {
  public tournaments: any;
  constructor(private router: Router, private eliteApi: EliteApi, private loadingController: LoadingController ) { }

  ngOnInit() {
  }

async ionViewWillEnter() {
  const loader = await this.loadingController.create({
      message : 'Getting tournaments...'
  });

  loader.present().then(() => {
    this.eliteApi.getTournaments().subscribe(data => {
      this.tournaments = data;
      loader.dismiss();
    });
  });

}

  itemTapped($event, tourney ) {
    const navigationExtras: NavigationExtras = { state: {data: tourney}};
    this.router.navigate(['teams'], navigationExtras);
  }
}