
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
  selector: 'app-competition-group',
  templateUrl: './competition-group.component.html',
  styleUrls: ['./competition-group.component.css']
})
export class CompetitionGroupComponent implements OnInit {

  GroupA_collection = [];
  GroupB_collection = [];
  GroupC_collection = [];
  GroupD_collection = [];
  GroupE_collection = [];
  GroupF_collection = [];
  GroupG_collection = [];
  GroupH_collection = [];

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

    var com = {
      comp_id:this.comp_id,
      competition_name:this.competition_name,
      season:this.season
    }
   console.log("com_",com);

     
    this.GetAllCompetitions();
  }

  GetAllCompetitions() {

    this.GroupA_collection = [];
    this.GroupB_collection = [];
    this.GroupC_collection = [];
    this.GroupD_collection = [];
    this.GroupE_collection = [];
    this.GroupF_collection = [];
    this.GroupG_collection = [];
    this.GroupH_collection = [];

    
    this.matchService.GetAllCompetitions_ById(this.comp_id, this.season).subscribe(data => {
      console.log("GetCompetitionStandingById", data);

      var result = data['data'];

      if (result !== undefined) {
        for (let group of result) {
          if (group['comp_group'] == "Group A") {
            //console.log("GroupA_data",group);
            this.GroupA_collection.push(group);
          }
          if (group['comp_group'] == "Group B") {
            //console.log("GroupB_data",group);
            this.GroupB_collection.push(group);
          }
          if (group['comp_group'] == "Group C") {
            //console.log("GroupC_data",group);
            this.GroupC_collection.push(group);
          }
          if (group['comp_group'] == "Group D") {
            //console.log("GroupD_data",group);
            this.GroupD_collection.push(group);
          }
          if (group['comp_group'] == "Group E") {
            //console.log("GroupE_data",group);
            this.GroupE_collection.push(group);
          }
          if (group['comp_group'] == "Group F") {
            //console.log("GroupF_data",group);
            this.GroupF_collection.push(group);
          }
          if (group['comp_group'] == "Group G") {
            //console.log("GroupG_data",group);
            this.GroupG_collection.push(group);
          }
          if (group['comp_group'] == "Group H") {
            //console.log("GroupH_data",group);
            this.GroupH_collection.push(group);
          }
        }
      }

    });







  }
  teamdetails(team_id) {
    this.router.navigate(['/team', team_id]);
  }

}
