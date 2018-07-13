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
import * as moment from 'moment-timezone';
import "moment-timezone";
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';
import { concat } from 'rxjs/operators';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  localtimezone;
  firstDay_Month;
  lastDay_Month;
  comp_id;
  competition_name;
  season;



  GroupA_collection = [];
  GroupB_collection = [];
  GroupC_collection = [];
  GroupD_collection = [];
  GroupE_collection = [];
  GroupF_collection = [];
  GroupG_collection = [];
  GroupH_collection = [];
  



  constructor(
    private matchesApiService: MatchesApiService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private liveMatchesApiService: MatchesApiService,
    private jsCustomeFun: JsCustomeFunScriptService) {

    this.localtimezone = this.jsCustomeFun.LocalTimeZone();
    this.firstDay_Month = this.jsCustomeFun.firstDay_Month();
    this.lastDay_Month = this.jsCustomeFun.lastDay_Month();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comp_id = parseInt(params.get("id"));
      this.competition_name = params.get("comp_name");
      this.season = params.get("season");
    });

  }

  ngOnInit() {
    this.setTimer();
  }

  public setTimer() {
    this.showloader = true;
    this.timer = Observable.timer(2000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.showloader = false;
    });
  }



}
