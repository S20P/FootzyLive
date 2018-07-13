
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
import { MatchesApiService } from '../service/live_match/matches-api.service';

@Component({
  selector: 'app-competition-matches',
  templateUrl: './competition-matches.component.html',
  styleUrls: ['./competition-matches.component.css']
})
export class CompetitionMatchesComponent implements OnInit {

  match_ground_details = [];
  localmatches = [];
  list_matches = [];
  League_name;

  comp_id;
  competition_name;
  season;

  // order: string;
  // data : any[] = [{name:'2018-06-24', artist:'rudy'},{name:'2018-06-19', artist:'drusko'},{name:'2018-07-14', artist:'needell'},{name:'2018-07-11', artist:'gear'}];
  // array: any[] = [{ name: 'John' }, { name: 'Mary' }, { name: 'Adam' }];
  // order: string = 'name';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe,
    private jsCustomeFun: JsCustomeFunScriptService,
    private liveMatchesApiService: MatchesApiService,

  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
      this.competition_name = params.get("comp_name");
      this.season = params.get("season");
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      this.GetMatchesByCompetition_ById_live();
    });

  }

  ngOnInit() {
    this.localmatches = [];

    this.GetAllCompetitions();
    this.GetLocaltypeMatches();
    // this.order ="formatted_date"; 
    // console.log("test-order-pipe", this.orderPipe.transform(this.data, this.order));



  }
  GetLocaltypeMatches() {
    this.localmatches = [];
    this.matchService.GetStaticMatches().subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.localmatches.push(res[i]);
      }
    });
  }





  GetAllCompetitions() {
    this.matchService.GetAllMatchesByWeek(this.comp_id, this.season).subscribe(data => {
      console.log("GetAllMatchesByWeek", data);
      var result = data['data'];
      var self = this;
      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];
        array.forEach(function (item) {
          var _id = item._id;
          var matche_data = item.entries;

          if (!groups[_id]) {
            groups[_id] = [];
            var formatted_date = self.jsCustomeFun.SpliteStrDateFormat(item.formatted_date);
            var checkstr = $.isNumeric(_id);
            var comp_name;
            if (checkstr == true) {
              comp_name = "Week " + _id;
            } else {
              comp_name = _id;
            }

            self.list_matches.push({ _id: comp_name, formatted_date: formatted_date, total: item.total, comp_id: item.comp_id });


            grouped.push({ type: { _id: comp_name, formatted_date: formatted_date, total: item.total, comp_id: item.comp_id }, group: groups[_id] });
          }
          for (let data of matche_data) {

            var paramDate = self.jsCustomeFun.SpliteStrDateFormat(data.formatted_date);


            let timezone = paramDate + " " + data.time;
            let match_time = self.jsCustomeFun.ChangeTimeZone(timezone);
            let live_status = self.jsCustomeFun.CompareTimeDate(match_time);

            var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + data.localteam_id + ".png";
            var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + data.visitorteam_id + ".png";

            var status;
            if (data.status == "") {
              status = match_time;
            }
            else {
              status = data.status;
            }

            var selected1 = self.jsCustomeFun.SpliteStrDateFormat(data.formatted_date);
            var date11 = new Date(selected1 + " " + data.time);

            let match_number;
            let match_type;
            for (let i = 0; i < self.localmatches['length']; i++) {

              let selected2 = self.jsCustomeFun.SpliteStrDateFormat(self.localmatches[i].formatted_date);
              var date22 = new Date(selected2 + " " + self.localmatches[i].time);

              if (data.id == self.localmatches[i].id) {
                // console.log("data is ok..", self.localmatches[i]);
                match_number = self.localmatches[i].match_number;
                match_type = self.localmatches[i].match_type;
              }
            }

            groups[_id].push({
              "comp_id": data.comp_id,
              "et_score": data.et_score,
              "formatted_date": data.formatted_date,
              "ft_score": data.ft_score,
              "ht_score": data.ht_score,
              "localteam_id": data.localteam_id,
              "localteam_name": data.localteam_name,
              "localteam_score": data.localteam_score,
              "localteam_image": flag__loal,
              "penalty_local": data.penalty_local,
              "penalty_visitor": data.penalty_visitor,
              "season": data.season,
              "status": status,
              "time": match_time,
              "venue": data.venue,
              "venue_city": data.venue_city,
              "venue_id": data.venue_id,
              "visitorteam_id": data.visitorteam_id,
              "visitorteam_name": data.visitorteam_name,
              "visitorteam_score": data.visitorteam_score,
              "visitorteam_image": flag_visit,
              "week": data.week,
              "_id": data._id,
              "id": data.id,
              "live_status": live_status,
              "match_number": match_number,
              "match_type": match_type,
              "competitions": data.competitions
            });
          }
        });

        this.match_ground_details = grouped;
        console.log("matches_Group", grouped);
      }
    });

    console.log("All Tops Matches by week are", this.match_ground_details);
    console.log("list dropdown", this.list_matches);


  }

  GetMatchesByCompetition_ById_live() {

    let current_matchId;
    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("Live-Matches-data", data);
      var result = data['data'];
      console.log("live data", data['data']['events']);
      // console.log("Matches is Live", data);
      if (result.events !== undefined) {
        var result_events = data['data'].events;
        //   console.log("live_item-data", live_item);
        current_matchId = result_events['id'];
        var item = result_events;
        for (let j = 0; j < this.match_ground_details['length']; j++) {
          console.log("**", this.match_ground_details[j]);
          var group = this.match_ground_details[j].group;

          for (let i = 0; i < group['length']; i++) {
            if (group[i].id == current_matchId) {
              console.log("group[i].id", group[i].id);
              console.log("current_matchId", current_matchId);
              var status_offon;
              status_offon = true;
              group[i]['status'] = item.status;
              group[i]['localteam_score'] = item.localteam_score;
              group[i]['visitorteam_score'] = item.visitorteam_score;
              group[i]['id'] = item.id;
              group[i]['live_status'] = status_offon;
            }
          }
        }
      }
    });

    console.log("match_ground_details", this.match_ground_details);

  }
  teamdetails(team_id) {
    this.router.navigate(['/team', team_id]);
  }
  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }

}
