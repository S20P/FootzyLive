
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
  selector: 'app-competition-player',
  templateUrl: './competition-player.component.html',
  styleUrls: ['./competition-player.component.css']
})
export class CompetitionPlayerComponent implements OnInit {

  player_collection = [];

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
    this.matchService.GetAllTopPlayerByCompId(this.comp_id, this.season).subscribe(data => {
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
           
            var flag = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + teams['player_id'] + ".jpg";
            groups[type].push({
              "player_id": teams['player_id'],
              "player_name": teams['player'],
              "count": teams['count'],
              "player_flag": flag
            });
          }
        });

        this.player_collection = grouped;
        console.log("player_group", grouped);
      }
    });

    console.log("All Tops Player are", this.player_collection);
  }
  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id]);
}
}
