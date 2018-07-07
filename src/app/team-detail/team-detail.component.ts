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
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  team_id;
  teams_collection = [];
  localmatches = [];

  team_squad_A = [];  //Attacker
  team_squad_D = [];  //Defender
  team_squad_G = [];  //Goalkeeper
  team_squad_F = [];  //Forward
  team_squad_M = [];  //Midfielder

  fullMatches = [];
  halfMatches = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) {

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      console.log("Live-Matches-data", data);
      console.log("live data1", data['data']['events']);
      var result = data['data'];
      var events = result.events;
      console.log("live events", events);
      this.GetMatchesByCompetition_ById_live();
    });
  }

  ngOnInit() {
    this.setTimer();
    this.localmatches = [];

    this.fullMatches = [];
    this.halfMatches = [];
   

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get("id"));
      this.team_id = id;
    });


    this.TeamDetails();

  }

  GetLocaltypeMatches() {
    this.localmatches = [];
    this.matchService.GetStaticMatches().subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.localmatches.push(res[i]);
      }
    });
  }

  //get Team-Details by TeamID
  TeamDetails() {
    this.GetLocaltypeMatches();

    this.teams_collection = [];

    this.fullMatches = [];
    this.halfMatches = [];
    this.team_squad_A = [];  //Attacker
    this.team_squad_D = [];  //Defender
    this.team_squad_G = [];  //Goalkeeper
    this.team_squad_F = [];  //Forward
    this.team_squad_M = [];  //Midfielder

    let team_id = this.team_id;

    this.matchService.GetTeamById(team_id).subscribe(data => {
      console.log("Team_Details", data);

      var result = data['data'];

      if (result !== undefined) {
        for (let teams of result) {

          var Teamflag = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + teams['team_id'] + ".png";
         
          //store Team_info
          this.teams_collection.push({
            "team_id": teams['team_id'],
            "team_name": teams['name'],
            "team_flag": Teamflag
          });

          var TeamMatch = teams['matchs'];

          if (TeamMatch !== undefined) {

            for (var j = 0; j < TeamMatch['length']; j++) {


              var myString = TeamMatch[j].formatted_date;
              console.log("strtrt", myString);
              var fulldate = this.jsCustomeFun.SpliteStrDateFormat(myString);
              //Change UTC timezone to IST(Local)
              let timezone = fulldate + " " + TeamMatch[j].time;

              let match_time = this.jsCustomeFun.ChangeTimeZone(timezone);
              console.log("time ", match_time);


              var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + TeamMatch[j].localteam_id + ".png";
              var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + TeamMatch[j].visitorteam_id + ".png";


           
              //store Team_matches
              var team_w = false;
              var team_l = false;
              var team_d = false;


              if (team_id == TeamMatch[j].localteam_id) {

                if (TeamMatch[j].localteam_score > TeamMatch[j].visitorteam_score) {
                  team_w = true;
                }
                if (TeamMatch[j].localteam_score < TeamMatch[j].visitorteam_score) {
                  team_l = true;
                }
              }

              if (team_id == TeamMatch[j].visitorteam_id) {

                if (TeamMatch[j].visitorteam_score > TeamMatch[j].localteam_score) {
                  team_w = true;
                }
                if (TeamMatch[j].visitorteam_score < TeamMatch[j].localteam_score) {
                  team_l = true;
                }

              }

              if (TeamMatch[j].localteam_score == TeamMatch[j].visitorteam_score) {
                team_d = true;
              }


              let live_status = this.jsCustomeFun.CompareTimeDate(match_time);
              var status;
              if (TeamMatch[j].status == "") {
                status = match_time;
              }
              else {
                status = TeamMatch[j].status;
              }

              var selected1 = this.jsCustomeFun.SpliteStrDateFormat(TeamMatch[j].formatted_date);
              var date11 = new Date(selected1);

              // var type = [];
              var match_number;
              var match_type;
              
              for (let i = 0; i < this.localmatches['length']; i++) {

                let selected2 = this.jsCustomeFun.SpliteStrDateFormat(this.localmatches[i].formatted_date);

                var date22 = new Date(selected2);

                if (date11.getTime() == date22.getTime()) {
                  console.log("data is ok..", this.localmatches[i]);
                  match_number = this.localmatches[i].match_number;
                  match_type = this.localmatches[i].match_type;
                }
              }


              //  console.log("type...", type);


              // match_number = type[j].match_number;
              //  match_type = type[j].match_type; 



              if (TeamMatch[j].status == "FT") {
                this.fullMatches.push(
                  {
                    "comp_id": TeamMatch[j].comp_id,
                    "localteam_id": TeamMatch[j].localteam_id,
                    "localteam_name": TeamMatch[j].localteam_name,
                    "localteam_score": TeamMatch[j].localteam_score,
                    "localteam_image": flag__loal,
                    "status": TeamMatch[j].status,
                    "time": match_time,
                    "visitorteam_id": TeamMatch[j].visitorteam_id,
                    "visitorteam_name": TeamMatch[j].visitorteam_name,
                    "visitorteam_score": TeamMatch[j].visitorteam_score,
                    "visitorteam_image": flag_visit,
                    "_id": TeamMatch[j]._id,
                    "id": TeamMatch[j].id,
                    "match_number": match_number,
                    "match_type": match_type,
                    "team_w": team_w,
                    "team_l": team_l,
                    "team_d": team_d,
                    "live_status": live_status
                  }
                )
              }
              if (TeamMatch[j].status !== "FT") {
                this.halfMatches.push({
                  "comp_id": TeamMatch[j].comp_id,
                  "localteam_id": TeamMatch[j].localteam_id,
                  "localteam_name": TeamMatch[j].localteam_name,
                  "localteam_score": TeamMatch[j].localteam_score,
                  "localteam_image": flag__loal,
                  "status": TeamMatch[j].status,
                  "time": match_time,
                  "visitorteam_id": TeamMatch[j].visitorteam_id,
                  "visitorteam_name": TeamMatch[j].visitorteam_name,
                  "visitorteam_score": TeamMatch[j].visitorteam_score,
                  "visitorteam_image": flag_visit,
                  "_id": TeamMatch[j]._id,
                  "id": TeamMatch[j].id,
                  "match_number": match_number,
                  "match_type": match_type,
                  "live_status": live_status

                });
              }
            }

          }

          var TeamSquad = teams['squad'];

          if (TeamSquad !== undefined) {
            for (let squad of TeamSquad) {
              //store Team_squad
              // Attacker---------
              if (squad['position'] == "A") {

                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
               

                this.team_squad_A.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": TeamPlayer_url
                });
              }
              // Defender----------  
              if (squad.position == "D") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
                
                this.team_squad_D.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": TeamPlayer_url
                });
              }
              // Forward----------              
              if (squad.position == "F") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
              
                this.team_squad_F.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": TeamPlayer_url
                });
              }
              // Goalkeeper----------                            
              if (squad.position == "G") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
              
                this.team_squad_G.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": TeamPlayer_url
                });
              }
              // Midfielder----------                                          
              if (squad.position == "M") {
                var TeamPlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + squad['id'] + ".jpg";
               
                this.team_squad_M.push({
                  "id": squad['id'],
                  "age": squad['age'],
                  "appearences": squad['appearences'],
                  "goals": squad['goals'],
                  "name": squad['name'],
                  "number": squad['number'],
                  "position": squad['position'],
                  "picture": TeamPlayer_url
                });
              }
            }
          }
          // });
        }
      }
    });




    console.log("fullMatches", this.fullMatches);
    console.log("halfMatches", this.halfMatches);



    console.log("Team_squad_A", this.team_squad_A);
    console.log("Team_squad_D", this.team_squad_D);
    console.log("Team_squad_F", this.team_squad_F);
    console.log("Team_squad_G", this.team_squad_G);
    console.log("Team_squad_M", this.team_squad_M);





  }

  GetMatchesByCompetition_ById_live() {
    let current_matchId;
    this.liveMatchesApiService.liveMatches().subscribe(data => {

      console.log("Live-Matches-data", data);

      var result = data['data'];

      console.log("live data", data['data']['events']);

      console.log("Matches is Live", data);
      if (result.events !== undefined) {

        var result_events = data['data'].events;

        current_matchId = result_events['id'];
        //   this.live_rcord.push(result_events);
        var item = result_events;

        for (let i = 0; i < this.halfMatches['length']; i++) {
          if (this.halfMatches[i].id == current_matchId) {

            var status_offon;

            status_offon = true;

            this.halfMatches[i]['status'] = item.status;
            this.halfMatches[i]['localteam_score'] = item.localteam_score;
            this.halfMatches[i]['visitorteam_score'] = item.visitorteam_score;
            this.halfMatches[i]['id'] = item.id;
            this.halfMatches[i]['live_status'] = status_offon;

          }
        }

      }
    });


  }

  matchdetails(id, comp_id) {
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }

  Playerdetails(player_id) {
    this.router.navigate(['/player', player_id]);
  }



  public setTimer() {
    this.showloader = true;
    $('#dd').refresh;
    this.timer = Observable.timer(2000);
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }
}
