import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewChecked,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { MatchesApiService } from '../service/live_match/matches-api.service';
import { MatchService } from '../service/match.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { DatePipe } from '@angular/common';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import * as moment from 'moment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  match_ground_details = [];
  currentdaydate;
  localmatches = [];

  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) { }

  ngOnInit() {
    this.localmatches = [];

          this.match_ground_details = [];
          var dateofday = Date();
          this.GetLocaltypeMatches();
          
          var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);

          this.liveMatchesApiService.liveMatches().subscribe(data => {
            console.log("Live-Matches-data", data);
            console.log("live data1", data['data']['events']);
            var result = data['data'];
            var events = result.events;
            console.log("live events", events);

            this.GetMatchesByCompetition_ById_live();

             });

    console.log("today side bar", currentdaydate);

    this.GetMatchesByDate(currentdaydate);
    this.currentdaydate = currentdaydate;

  }


  GetLocaltypeMatches() {
    this.localmatches = [];
    this.matchService.GetStaticMatches().subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.localmatches.push(res[i]);
      }
    });
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

        for (let i = 0; i < this.match_ground_details['length']; i++) {
          if (this.match_ground_details[i].id == current_matchId) {

            var status_offon;

            status_offon = true;
            this.match_ground_details[i]['status'] = item.status;
            this.match_ground_details[i]['localteam_score'] = item.localteam_score;
            this.match_ground_details[i]['visitorteam_score'] = item.visitorteam_score;
            this.match_ground_details[i]['id'] = item.id;
            this.match_ground_details[i]['live_status'] = status_offon;
          }
        }

      }
    });
  }



  GetMatchesByDate(selected) {
    this.GetLocaltypeMatches();

    console.log("selected date is...", selected);
   
    // let result = [];
    this.match_ground_details = [];

    for (let i = 0; i < this.match_ground_details['length']; i++) {
      this.match_ground_details.splice(i, 1);
    }

    //  console.log("dddddd",paramDate);
    // parameter: date (Date Format Must be YYYY-MM-DD)-------------
    // let date = paramDate;
    this.matchService.GetMatchesByDate(selected).subscribe(data => {
      console.log("GetMatchesByDate", data);
      // this.match_ground_details.push(data['data']);

      var result = data['data'];
      if (result !== undefined) {
        for (var j = 0; j < result['length']; j++) {

         //Change UTC timezone to IST(Local)
          let timezone = selected + " " + result[j].time;
          console.log("rrrr", timezone);
          let match_time = this.jsCustomeFun.ChangeTimeZone(timezone);
          let live_status = this.jsCustomeFun.CompareTimeDate(match_time);
          console.log("time ", match_time);

          var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[j].localteam_id + ".png";
          var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[j].visitorteam_id + ".png";


          var status;
          if (result[j].status == "") {
            status = match_time;
          }
          else {
            status = result[j].status;
          }
     
        
          var selected1 = this.jsCustomeFun.SpliteStrDateFormat(result[j].formatted_date);
          var date11 = new Date(selected1 + " " + result[j].time);
          var match_number;
          var match_type;
          for (let i = 0; i < this.localmatches['length']; i++) {

            let selected2 = this.jsCustomeFun.SpliteStrDateFormat(this.localmatches[i].formatted_date);

            var date22 = new Date(selected2 + " " + this.localmatches[i].time);

            if (date11.getTime() == date22.getTime()) {
              console.log("data is ok..", this.localmatches[i]);
              match_number =this.localmatches[i].match_number;
              match_type =this.localmatches[i].match_type;
            }
          }
          
          this.match_ground_details.push({
            "comp_id": result[j].comp_id,
            "et_score": result[j].et_score,
            "formatted_date": result[j].formatted_date,
            "ft_score": result[j].ft_score,
            "ht_score": result[j].ht_score,
            "localteam_id": result[j].localteam_id,
            "localteam_name": result[j].localteam_name,
            "localteam_score": result[j].localteam_score,
            "localteam_image": flag__loal,
            "penalty_local": result[j].penalty_local,
            "penalty_visitor": result[j].penalty_visitor,
            "season": result[j].season,
            "status": status,
            "time": match_time,
            "venue": result[j].venue,
            "venue_city": result[j].venue_city,
            "venue_id": result[j].venue_id,
            "visitorteam_id": result[j].visitorteam_id,
            "visitorteam_name": result[j].visitorteam_name,
            "visitorteam_score": result[j].visitorteam_score,
            "visitorteam_image": flag_visit,
            "week": result[j].week,
            "_id": result[j]._id,
            "id": result[j].id,
            "live_status": live_status,
            "match_number": match_number,
            "match_type": match_type,
          });

        }
      }
    });


    //result = [];
    console.log("filter-date_data", this.match_ground_details);
    //this.match_ground_details = [];
  }



  matchdetails_go(id, comp_id) {
    console.log("123", id + "-" + "-" + comp_id);
    this.router.navigate(['/matches', id, { "comp_id": comp_id }]);
  }
}
