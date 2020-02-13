import { UserSettings } from './../services/user-settings.service';
import { EliteApi } from './../services/elite-api.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss']
})
export class TeamDetailPage implements OnInit, OnDestroy {
  public allGames = [];
  public team: any = {};
  public filtergames = [];
  public games = [];
  public tourneyData: any;
  public teamStanding: any = {};
  public dateFilter: string;
  public useDateFilter = false;
  public isFollowing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eliteApi: EliteApi,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private userSettings: UserSettings ) {
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
      message: 'Getting games...'
    });

    loader.present().then(() => {
      this.eliteApi.getCurrentTourney().subscribe(data => {
        this.tourneyData = data;
        this.games = data.games;
              // tslint:disable-next-line: align
              this.filtergames = _.chain(this.games).filter(g => g.team1Id === this.team.id || g.team2Id === this.team.id)
              .map(g => {
                  const isTeam1 = (g.team1Id === this.team.id);
                  const oppenentName = isTeam1 ? g.team2 : g.team1;
                  const scoreDisplay = this.getScoreDisplay(isTeam1, g.team1Score, g.team2Score);
                  return{
                      gameId: g.id,
                      opponent: oppenentName,
                      time: Date.parse(g.time),
                      location: g.location,
                      locationUrl: g.locationId,
                      scoreDisplay,
                      homeAway: (isTeam1 ? 'vs.' : 'at.')
                  };
              })
              .value();
        this.allGames = this.filtergames;
        this.teamStanding = _.find(data.standings, { teamId: this.team.id});

        this.userSettings.isfavoriteTeam(this.team.id.toString()).then(value => this.isFollowing = value);
        loader.dismiss();
        });
    });

  }

  dateChanged() {
    if (this.useDateFilter) {
      this.filtergames = _.filter(this.allGames, g => moment(g.time).isSame(this.dateFilter, 'day'));
    }  else {
      this.filtergames = this.allGames;
    }
  }

  private getScoreDisplay(isTeam1, team1Score, team2Score) {
    if (team1Score && team2Score) {
      const teamScore = (isTeam1 ? team1Score : team2Score);
      const oppnentScore = (isTeam1 ? team2Score : team1Score);
      const winIndicator = teamScore > oppnentScore ? 'W: '  : 'L: ';
      return winIndicator + teamScore + '-' + oppnentScore;
    } else {
      return '';
    }
  }

  gameClicked($event, game) {
    const sourceGame = this.games.find(g => g.id === game.gameId);
    const navigationExtras: NavigationExtras = { state: { data: sourceGame } };
    this.router.navigate(['game'], navigationExtras);
  }

  getScoreWonL(game) {
    return game.scoreDisplay ? game.scoreDisplay[0] : '';
  }
  getScoreDisplayBadgeClass(game) {
    return game.scoreDisplay.indexOf('W:') === 0 ? 'primary' : 'danger';
  }

  async toggleFollow() {
    if (this.isFollowing) {
      const confirm =  await this.alertController.create({
          header: 'Unfollow?',
          message: 'Are you sure you want to unfollow?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.isFollowing = false;
                this.userSettings.unfavoriteTeam(this.team);
                const message = 'You have unfollowed this team.';
                this.presentToastWithOptions(message);
              }
            },
            {
              text: 'No'
            }
          ]
      });
      await  confirm.present();
    } else {
        const confirm =  await this.alertController.create({
          header: 'follow?',
          message: 'Are you sure you want to follow this team.',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.isFollowing = true;
                this.userSettings.favoriteTeam(this.team, this.tourneyData.tournament.id, this.tourneyData.tournament.name);
                const message = 'You have followed this team.';
                this.presentToastWithOptions(message);
              }
            },
            {
              text: 'No'
            }
          ]
      });
        await confirm.present();
    }
  }

  async presentToastWithOptions(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
}

refreshAll(refresher) {
  // this.eliteApi.refreshCurrentTourney().subscribe(() => { refresher.complete(); });
  // this.ionViewWillEnter();
}
  ngOnDestroy() {
    this.team = null;
    this.games = null;
    this.filtergames = null;
  }
}
