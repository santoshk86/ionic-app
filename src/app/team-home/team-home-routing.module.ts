import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamHomePage } from './team-home.page';

const routes: Routes = [
  {
    path: '',
    component: TeamHomePage,
    children: [
      {
        path: 'teamDetailTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../team-detail/team-detail.module').then(m => m.TeamDetailPageModule)
          }
        ]
      },
      {
        path: 'standingsTab',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../standings/standings.module').then(m => m.StandingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/team-home/teamDetailTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/team-home/teamDetailTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamHomePageRoutingModule {}
