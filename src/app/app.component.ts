import { UserSettings } from './services/user-settings.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Events, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  favoriteTeams: any[];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private userSettings: UserSettings,
    private events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log('initializeApp');
      this.events.subscribe('favorites:changed', () => this.refreshFavorites());
      this.refreshFavorites();
    });
  }
  goHome() {
    this.router.navigate(['my-teams']);
  }

  gotoTournament() {
    this.router.navigate(['tournaments']);
  }

  refreshFavorites() {
    this.favoriteTeams = this.userSettings.getAllFavorites();
  }
  gotoTeam(favorite) {
  }

}
