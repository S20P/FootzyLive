
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

@Component({
  selector: 'app-competition-teams',
  templateUrl: './competition-teams.component.html',
  styleUrls: ['./competition-teams.component.css']
})
export class CompetitionTeamsComponent implements OnInit {
  teams_collection = [];

  comp_id;
  competition_name;
  season;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService
  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
      this.competition_name = params.get("comp_name");
      this.season = params.get("season");
    });
  }

  ngOnInit() {
    this.GetAllCompetitions();

  }
  GetAllCompetitions() {
    this.matchService.GetAllTopTeamByCompId(this.comp_id, this.season).subscribe(data => {
      console.log("GetAllTopTeamByCompId", data);
      var result = data['data'];

      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];
        array.forEach(function (item) {
          var type = item.type;
          var detailsOfTeam = item.data;

          if (!groups[type]) {
            groups[type] = [];
            grouped.push({ type: type, group: groups[type] });
          }
          for (let teams of detailsOfTeam) {
            var Teamflag = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + teams['teamid'] + ".png";
            groups[type].push({
              "team_id": teams['teamid'],
              "team_name": teams['teamname'],
              "count": teams['count'],
              "team_flag": Teamflag
            });
          }
        });

        this.teams_collection = grouped;
        console.log("ggggg", grouped);
      }
    });

    console.log("All Tops Teams are", this.teams_collection);
  }
  teamdetails(team_id,team_name) {
    this.router.navigate(['/team', team_id,{ "team_name": team_name }]);
  }
}
