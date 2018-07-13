import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchesDashboardComponent } from './matches-dashboard/matches-dashboard.component';
import { MatchesDetailComponentComponent } from './matches-detail-component/matches-detail-component.component';
import { MatchGroupComponent } from './match-group/match-group.component';
import { MatchStadiumComponent } from './match-stadium/match-stadium.component';
import { StadiumDetailComponent } from './stadium-detail/stadium-detail.component';
import { MatchTeamsComponent } from './match-teams/match-teams.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { CompetitionComponent } from './competition/competition.component';

const routes: Routes = [
  { path: '', redirectTo: 'matches', pathMatch: 'full' },
  { path: 'matches', component: MatchesDashboardComponent },  //All Matches
  { path: 'matches/:id', component: MatchesDetailComponentComponent },//Matche details
  { path: 'group', component: MatchGroupComponent },  //All Group
  { path: 'stadium', component: MatchStadiumComponent },  //All Stadium
  { path: 'stadium/:id', component: StadiumDetailComponent },  //Stadium details
  { path: 'teams', component: MatchTeamsComponent },  //All Teams
  { path: 'team/:id', component: TeamDetailComponent },  //Team details
  { path: 'player/:id', component: PlayerDetailComponent },  //Team details
  { path: 'competition/:id', component: CompetitionComponent },  //Team details
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MatchesDashboardComponent,
  MatchesDetailComponentComponent,
  MatchGroupComponent,
  MatchStadiumComponent,
  StadiumDetailComponent,
  MatchTeamsComponent,
  TeamDetailComponent,
  PlayerDetailComponent,
  CompetitionComponent
];
