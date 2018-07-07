
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-match-group',
  templateUrl: './match-group.component.html',
  styleUrls: ['./match-group.component.css']
})
export class MatchGroupComponent implements OnInit {

  public showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  AllCompetitions = [];


  GroupA_collection = [];
  GroupB_collection = [];
  GroupC_collection = [];
  GroupD_collection = [];
  GroupE_collection = [];
  GroupF_collection = [];
  GroupG_collection = [];
  GroupH_collection = [];

    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private orderPipe: OrderPipe
  ) { }

  ngOnInit() {
    this.setTimer();
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

    this.matchService.GetAllCompetitions().subscribe(data => {
      //console.log("GetAllCompetitions",data);
      this.AllCompetitions = data['data'];
      for (var i = 0; i < this.AllCompetitions.length; i++) {

        //filter group for FIFA 1056 only
        if(this.AllCompetitions[i].id==1056){
        this.matchService.GetAllCompetitions_ById(this.AllCompetitions[i].id).subscribe(data => {
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
      }
    });


    console.log("GroupA_collection", this.GroupA_collection);
    console.log("GroupB_collection", this.GroupB_collection);
    console.log("GroupC_collection", this.GroupC_collection);
    console.log("GroupD_collection", this.GroupD_collection);
    console.log("GroupE_collection", this.GroupE_collection);
    console.log("GroupF_collection", this.GroupF_collection);
    console.log("GroupG_collection", this.GroupG_collection);
    console.log("GroupH_collection", this.GroupH_collection);


  }
  teamdetails(team_id) {
    this.router.navigate(['/team',team_id]);
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
