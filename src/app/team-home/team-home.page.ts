import { ActivatedRoute, Router } from '@angular/router';
import { StandingsPage } from './../standings/standings.page';
import { TeamDetailPage } from './../team-detail/team-detail.page';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.page.html',
  styleUrls: ['./team-home.page.scss'],
})
export class TeamHomePage implements OnInit, OnDestroy {
  public team: any = {};
  public teamDetailTab = TeamDetailPage;
  public standingsTab = StandingsPage;
  constructor(private route: ActivatedRoute, private router: Router) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.team = this.router.getCurrentNavigation().extras.state.data;
      }
    });
   }

  ngOnInit() {
  }

  goHome() {
      this.router.navigate(['my-teams']);
  }
  ngOnDestroy() {
    this.team = null;
  }
}
