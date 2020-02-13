import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EliteApi } from '../services/elite-api.service';
import { LoadingController } from '@ionic/angular';
import * as _ from 'lodash';
declare var window: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public game: any = {};
  public map: any = {};
  public location: any = {};
  constructor(
    private route: ActivatedRoute, private router: Router, private eliteApi: EliteApi,
    private loadingController: LoadingController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.game = this.router.getCurrentNavigation().extras.state.data;
      }
    });
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    const loader = await this.loadingController.create({
      message: 'Getting map...'
    });

    loader.present().then(() => {

    this.eliteApi.getCurrentTourney().subscribe(data => { this.location = data.locations[this.game.locationId]; });
    this.map = {
      lat: this.location.latitude,
      lng: this.location.longitude,
      zoom: 12,
      markerLabel: this.game.location
    };

    loader.dismiss();
  });
}

goToDirections() {
  window.location = `geo:${this.location.latitude},${this.location.longitude};u=35;`;
}
}
