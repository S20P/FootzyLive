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
// import * as moment from 'moment';

import * as moment from 'moment-timezone';
import "moment-timezone";
// import * as moment from 'moment';
// import * as tz from "moment-timezone";

import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';


@Component({
  selector: 'app-matches-dashboard',
  templateUrl: './matches-dashboard.component.html',
  styleUrls: ['./matches-dashboard.component.css']
})

export class MatchesDashboardComponent implements OnInit {
  message: string;
  messages = [];
  paramDate: any;
  AllCompetitions = [];
  AllCompetitions_match = [];
  match_ground_details = [];
  datepicker_afterview;
  alldaymatch_list = [];
  lastHeightPosted = null;
  loading;
  // match_dropdown_title = [
  //   "TODAY'S MATCHES",
  //   "All Matches",
  //   "Group Matches",
  //   "Round of 16",
  //   "Quater-Finals",
  //   "Semi-Finals",
  //   "For 3rd Place",
  //   "Final",
  // ];
  localmatches = [];
  All_Matches = [];
  timezone;
  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  todays_Matches_title;

  constructor(private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService

  ) { }


  ngOnInit() {



    // var utcTime = moment.utc("2018-06-30 18:00").format('YYYY-MM-DD HH:mm');      
    // var localTime  = moment.utc(utcTime).toDate();
    // console.log("IST Date : ", moment(localTime).format('YYYY-MM-DD hh:mm:ss a'));



    this.localmatches = [];
    this.match_ground_details = [];

    // moment.js utc local timezone UTC

    this.setTimer();
    this.GetLocaltypeMatches();

    this.GetAllCompetitions();
    this.dateSchedule_ini();

    $('#datepicker').datepicker();

    $('#datepicker').datepicker('setDate', 'today');

    var today = $('#datepicker').val();
    this.paramDate = today;

    console.log("today", this.paramDate);
    this.todays_Matches_title = today;

    var dateofday = Date();
    var currentdaydate = this.jsCustomeFun.ChangeDateFormat(dateofday);

    this.GetMatchesByDate(this.paramDate);

    let self = this;
    $("#datepicker").on("change", function () {
      var selected = $(this).val();
      console.log("date is one", selected);
      this.paramDate = selected;
      this.todays_Matches_title = selected;
      console.log("date is currentdaydate", currentdaydate);
      self.GetMatchesByDate(selected);
    });

    this.liveMatchesApiService.liveMatches().subscribe(data => {
      // console.log("Live-Matches-data", data);
      // console.log("live data1", data['data']['events']);
      // var result = data['data'];
      // var events = result.events;
      // console.log("live events", events);

      this.GetMatchesByCompetition_ById_live();

    });





  }

  // GetAllKnockout(){
  //   this.matchService.GetAllKnockout().subscribe(data => {
  //     console.log("GetAllKnockout", data);
  //   });
  // }

  get_title(title) {
    console.log("title is", title);
  }


  GetLocaltypeMatches() {
    this.localmatches = [];

    this.matchService.GetStaticMatches().subscribe(res => {
      for (let i = 0; i < res['length']; i++) {
        this.localmatches.push(res[i]);
      }
    });
  }


  dateSchedule_ini() {

    //this.loadjquery();
    var array = this.alldaymatch_list;

    console.log("date-list", this.alldaymatch_list);

    $('#datepicker').datepicker({
      //changeMonth: true,
      // changeYear: true,
      inline: true,
      showOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      beforeShowDay: function (date) {
        var string = $.datepicker.formatDate('yy-mm-dd', date);
        if (array.indexOf(string) != -1) {
          return [true];
        }
        return [true, "highlight", string];
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

    console.log("match_ground_details", this.match_ground_details);

  }

  GetMatchesByDate(selected) {

    // this.loadjquery();

    this.todays_Matches_title = selected;
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
          // this.timezone = timezone;

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

          //   var type = [];
          let match_number;
          let match_type;
          for (let i = 0; i < this.localmatches['length']; i++) {

            let selected2 = this.jsCustomeFun.SpliteStrDateFormat(this.localmatches[i].formatted_date);
            var date22 = new Date(selected2 + " " + this.localmatches[i].time);

            if (result[j].id == this.localmatches[i].id) {
              console.log("data is ok..", this.localmatches[i]);
              match_number = this.localmatches[i].match_number;
              match_type = this.localmatches[i].match_type;

            }
            // if (date11.getTime() == date22.getTime()) {
            //   console.log("data is ok..", this.localmatches[i]);
            //   match_number = this.localmatches[i].match_number;
            //   match_type = this.localmatches[i].match_type;
            // }

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

    console.log("filter-date_data", this.match_ground_details);

  }


  GetAllCompetitions() {

    this.All_Matches = [];
    //this.alldaymatch_list = [];

    this.matchService.GetAllCompetitions().subscribe(data => {
      //console.log("GetAllCompetitions",data);
      this.AllCompetitions = data['data'];
      for (var i = 0; i < this.AllCompetitions.length; i++) {

        if (this.AllCompetitions[i].id == '1056') {

          this.AllCompetitions_match.push({
            "id": this.AllCompetitions[i].id, "name": this.AllCompetitions[i].name,
          }
          );

          this.matchService.GetAllCompetitions_ById(this.AllCompetitions[i].id).subscribe(data => {
            console.log("GetCompetitionStandingById", data);
          });

          this.matchService.GetMatchesByCompetition_ById(this.AllCompetitions[i].id).subscribe(data => {
            console.log("GetMatchesByCompetition_ById", data);

            var result = data['data'];

            this.All_Matches.push(result);

            if (result !== undefined) {
              for (var k = 0; k < result.length; k++) {
                let myString = result[k].formatted_date;

                let fulldate = this.jsCustomeFun.SpliteStrDateFormat(myString);

                this.alldaymatch_list.push(fulldate);
                this.loadjquery();

              }
            }
          });
        }
      }
    });
    console.log('AllCompetitions_details', this.AllCompetitions_match);
  }

  matchdetails(id, comp_id) {
    this.router.navigate([id, { "comp_id": comp_id }], { relativeTo: this.route });
  }

  loadjquery() {
    setTimeout(function () {
      $("#datepicker").datepicker("refresh");
    }, 1);
  }

  sendMessage() {
    //  console.log("message",this.message);
    let msg = this.matchesApiService.sendMessage(this.message);
    //  console.log("msg sent",msg);
    this.message = '';
  }
  public setTimer() {

    // set showloader to true to show loading div on view
    this.showloader = true;

    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      // set showloader to false to hide loading div from view after 5 seconds
      this.showloader = false;
    });
  }






}
