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
  team_name;
  team_flage;

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
    this.setTimer();
    this.team_flage = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + this.team_id + ".png";
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
