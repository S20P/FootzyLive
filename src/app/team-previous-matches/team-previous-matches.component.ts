import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;

import { DatePipe } from '@angular/common';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';

@Component({
  selector: 'app-team-previous-matches',
  templateUrl: './team-previous-matches.component.html',
  styleUrls: ['./team-previous-matches.component.css']
})
export class TeamPreviousMatchesComponent implements OnInit {

  team_id;
  team_name;
  team_flage;
  localmatches = [];
  PreviousMatchesTeam = [];

   constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
      let team_name = params.get("team_name");
      this.team_name = team_name;
    });
  
  }


  ngOnInit() {
    
    this.team_flage = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + this.team_id + ".png";
    this.PreviousMatchesTeam = [];
    this.GetLocaltypeMatches();
    this.GetPreviousMatches();
    
   }

   GetLocaltypeMatches() {
    this.localmatches = [];
    this.matchService.GetStaticMatches().subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.localmatches.push(res[i]);
      }
    });
  }

   GetPreviousMatches() {
    this.PreviousMatchesTeam = [];

    for (let i = 0; i < this.PreviousMatchesTeam['length']; i++) {
      this.PreviousMatchesTeam.splice(i, 1);
    }

    let team_id = this.team_id;

    this.matchService.GetPreviousMatchesTeamById(team_id).subscribe(record => {
      console.log("PreviousMatches res", record);

      var result = record['data'];

      var self = this;

     

      if (result !== undefined) {

        var array = result,
          groups = Object.create(null),
          grouped = [];

        array.forEach(function (item) {
          var paramDate = self.jsCustomeFun.SpliteStrDateFormat(item.formatted_date);
          let timezone = paramDate + " " + item.time;
          let match_time = self.jsCustomeFun.ChangeTimeZone(timezone);
          let live_status = self.jsCustomeFun.CompareTimeDate(match_time);

          var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + item.localteam_id + ".png";
          var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + item.visitorteam_id + ".png";
          
          var team_w = false;
          var team_l = false;
          var team_d = false;

          if (team_id == item.localteam_id) {

            if (item.localteam_score > item.visitorteam_score) {
              team_w = true;
            }
            if (item.localteam_score < item.visitorteam_score) {
              team_l = true;
            }
          }

          if (team_id == item.visitorteam_id) {

            if (item.visitorteam_score > item.localteam_score) {
              team_w = true;
            }
            if (item.visitorteam_score < item.localteam_score) {
              team_l = true;
            }

          }

          if (item.localteam_score == item.visitorteam_score) {
            team_d = true;
          }

          var status;
          if (item.status == "") {
            status = match_time;
          }
          else {
            status = item.status;
          }

          var selected1 = self.jsCustomeFun.SpliteStrDateFormat(item.formatted_date);
          var date11 = new Date(selected1 + " " + item.time);

          let match_number;
          let match_type;
          for (let i = 0; i < self.localmatches['length']; i++) {

            let selected2 = self.jsCustomeFun.SpliteStrDateFormat(self.localmatches[i].formatted_date);
            var date22 = new Date(selected2 + " " + self.localmatches[i].time);

            if (item.id == self.localmatches[i].id) {
              match_number = self.localmatches[i].match_number;
              match_type = self.localmatches[i].match_type;
            }
          }
          var competitions = item.competitions;

          if (!groups[competitions.id]) {
            groups[competitions.id] = [];
            grouped.push({ type: competitions, group: groups[competitions.id] });
          }
          groups[competitions.id].push({
            "comp_id": item.comp_id,
            "et_score": item.et_score,
            "formatted_date": item.formatted_date,
            "ft_score": item.ft_score,
            "ht_score": item.ht_score,
            "localteam_id": item.localteam_id,
            "localteam_name": item.localteam_name,
            "localteam_score": item.localteam_score,
            "localteam_image": flag__loal,
            "penalty_local": item.penalty_local,
            "penalty_visitor": item.penalty_visitor,
            "season": item.season,
            "status": status,
            "time": match_time,
            "venue": item.venue,
            "venue_city": item.venue_city,
            "venue_id": item.venue_id,
            "visitorteam_id": item.visitorteam_id,
            "visitorteam_name": item.visitorteam_name,
            "visitorteam_score": item.visitorteam_score,
            "visitorteam_image": flag_visit,
            "week": item.week,
            "_id": item._id,
            "id": item.id,
            "live_status": live_status,
            "match_number": match_number,
            "match_type": match_type,
            "competitions": item.competitions,
            "team_w": team_w,
            "team_l": team_l,
            "team_d": team_d,
          });
        });
        console.log("grouped", grouped);
        this.PreviousMatchesTeam = grouped;
      }
    })
  }

  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }
  CompetitionDetails(comp_id,comp_name,season){
    console.log("going to CompetitionDetails page...",comp_id);
    this.router.navigate(['/competition', comp_id,{ "comp_name": comp_name,"season":season }]);
 }
 
}
