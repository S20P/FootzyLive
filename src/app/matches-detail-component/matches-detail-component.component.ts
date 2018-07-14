import { Component, OnInit, Pipe, PipeTransform, Directive, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatchService } from '../service/match.service';

import { MatchesApiService } from '../service/live_match/matches-api.service';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
declare var jQuery: any;
declare var $: any;
import { DatePipe } from '@angular/common';
import { JsCustomeFunScriptService } from '../service/jsCustomeFun/jsCustomeFunScript.service';



@Component(
    {
        selector: 'app-matches-detail-component',
        templateUrl: './matches-detail-component.component.html',
        styleUrls: ['./matches-detail-component.component.css']
    }
)
export class MatchesDetailComponentComponent implements OnInit {

    public id;
    public comp_id;
    match_detailcollection = [];
    events_collection = [];
    // Line_up_collection = [];
    localteam_player_lineup = [];
    visitorteam_player_lineup = [];
    localteam_player_subs = [];
    visitorteam_player_subs = [];
    Commentary_collection = [];

    ic_event_penalty_scored;
    ic_event_own_goal;
    ic_event_goal;

    match_stats_collection = [];

    public showloader: boolean = false;
    private subscription: Subscription;
    private timer: Observable<any>;

    statsA_min;
    status;
    live_matches: boolean;


    // player_image = 'assets/img/avt_player.png';


    // avt_player = 'assets/img/avt_player.png';
    // <img [src]="player.picture" onError="this.src='assets/img/avt_player.png'" />

    // avt_flage = 'assets/img/avt_flag.jpg';
    // <img [src]="item_details.localteam_image"  onError="this.src='assets/img/avt_flag.jpg'" />
    // <img [src]="item_details.visitorteam_image"  onError="this.src='assets/img/avt_flag.jpg'" />

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private matchService: MatchService,
        public datepipe: DatePipe,
        private liveMatchesApiService: MatchesApiService,
        private jsCustomeFun: JsCustomeFunScriptService
    ) {

        this.ic_event_penalty_scored = false;
        this.ic_event_own_goal = false;
        this.ic_event_goal = false;
        this.live_matches = false;
        this.route.paramMap.subscribe((params: ParamMap) => {
            let id = parseInt(params.get("id"));
            this.id = id;
            let comp_id = parseInt(params.get("comp_id"));
            this.comp_id = comp_id;
            //   this.GetMatchesByCompetition_ById();
            //   this.GetCommentariesByMatchId(this.id);
            this.GetMatchDeatilByMatchId(this.id);
        });
    }

    ngOnInit() {

        this.match_detailcollection = [];
        this.events_collection = [];

        this.liveMatchesApiService.liveMatches().subscribe(data => {
            console.log("Live-Matches-data", data);
            console.log("live data1", data['data']['events']);
            var result = data['data'];
            var events = result.events;
            console.log("live events", events);
            this.GetMatchesByCompetition_ById_live();
            //  this.loading = "none";
            this.GetCommentariesByMatchId_live();
        });

        this.statsA_min = '20';

        this.setTimer();

        //  this.setDefaultPic();


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




    GetMatchesByCompetition_ById_live() {
        // this.match_detailcollection =[];
        let current_matchId;

        this.liveMatchesApiService.liveMatches().subscribe(data => {

            console.log("Live-Matches-data", data);

            var result = data['data'];

            console.log("live data", data['data']['events']);

            console.log("Matches is Live", data);
            if (result.events !== undefined) {

                this.live_matches = true;
                var result_events = data['data'].events;
                console.log("date is ", result_events.formatted_date);

                current_matchId = result_events['id'];

                for (let i = 0; i < this.match_detailcollection['length']; i++) {
                    if (this.match_detailcollection[i].id == current_matchId) {

                        var status_offon;
                        status_offon = true;

                        this.match_detailcollection[i]['status'] = result_events.status;
                        this.match_detailcollection[i]['localteam_score'] = result_events.localteam_score;
                        this.match_detailcollection[i]['visitorteam_score'] = result_events.visitorteam_score;
                        this.match_detailcollection[i]['id'] = result_events.id;
                        this.match_detailcollection[i]['live_status'] = status_offon;

                        let events_data = result_events['events'];
                        for (var e = 0; e < events_data['length']; e++) {

                            let result_pipe_l = events_data[e].result.replace(']', '');
                            let result_pipe = result_pipe_l.replace('[', '');

                            let ic_event_penalty_scored = false;
                            let ic_event_own_goal = false;
                            let ic_event_goal = false;
                            var type = events_data[e].type;

                            if (type == "goal") {

                                let player = events_data[e].player;
                                if (player.includes("(pen.)")) {
                                    ic_event_penalty_scored = true;
                                }
                                else if (player.includes("(o.g.)")) {
                                    ic_event_own_goal = true;
                                }
                                else {
                                    ic_event_goal = true;
                                }

                            }

                            this.events_collection[e]['id'] = events_data[e].id;
                            this.events_collection[e]['type'] = events_data[e].type;
                            this.events_collection[e]['minute'] = events_data[e].minute;
                            this.events_collection[e]['extra_min'] = events_data[e].extra_min;
                            this.events_collection[e]['team'] = events_data[e].team;
                            this.events_collection[e]['assist'] = events_data[e].assist;
                            this.events_collection[e]['assist_id'] = events_data[e].assist_id;
                            this.events_collection[e]['player'] = events_data[e].player;
                            this.events_collection[e]['player_id'] = events_data[e].player_id;
                            this.events_collection[e]['result'] = events_data[e].result;
                            this.events_collection[e]['ic_event_penalty_scored'] = events_data[e].ic_event_penalty_scored;
                            this.events_collection[e]['ic_event_own_goal'] = events_data[e].ic_event_own_goal;
                            this.events_collection[e]['ic_event_goal'] = events_data[e].ic_event_goal;



                            // this.events_collection
                            //     .push({
                            //         "id": events_data[e].id,
                            //         "type": events_data[e].type,
                            //         "minute": events_data[e].minute,
                            //         "extra_min": events_data[e].extra_min,
                            //         "team": events_data[e].team,
                            //         "assist": events_data[e].assist,
                            //         "assist_id": events_data[e].assist_id,
                            //         "player": events_data[e].player,
                            //         "player_id": events_data[e].player_id,
                            //         "result": result_pipe,
                            //         "ic_event_penalty_scored": ic_event_penalty_scored,
                            //         "ic_event_own_goal": ic_event_own_goal,
                            //         "ic_event_goal": ic_event_goal
                            //     });
                        }
                    }
                }
            }
        });
    }



    // GetMatchesByCompetition_ById() {
    //     this.match_detailcollection = [];
    //     this.events_collection = [];
    //     this.matchService.GetMatchesByCompetition_ById(this.comp_id).subscribe(data => {

    //         console.log("GetMatchesByCompetition_ById", data);

    //         var result = data['data'];


    //         if (result !== undefined) {

    //             console.log("--------------------");
    //             console.log("data", result)

    //             this.status = result['status'];

    //             for (var k = 0; k < result.length; k++) {


    //                 if (result[k].id == this.id) {

    //                     console.log("current page data", result[k]);

    //                     let date_formatted = result[k].formatted_date.replace('.', '/');
    //                     let date = date_formatted.replace('.', '/');

    //                     //Change UTC timezone to IST(Local)
    //                     var myString = result[k].formatted_date;

    //                     var fulldate = this.jsCustomeFun.SpliteStrDateFormat(myString);


    //                     //Change UTC timezone to IST(Local)
    //                     let timezone = fulldate + " " + result[k].time;
    //                     let match_time = this.jsCustomeFun.ChangeTimeZone(timezone);

    //                     console.log("time ", match_time);

    //                     //let current_matchId = result[0].id;
    //                     //  this.GetCommentariesByMatchId(current_matchId);

    //                     var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[k].localteam_id + ".png";
    //                     var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[k].visitorteam_id + ".png";



    //                     console.log(":Matches tiem:", match_time);
    //                     let live_status = this.jsCustomeFun.CompareTimeDate(match_time);

    //                     var status;
    //                     if (result[k].status == "") {
    //                         status = match_time;
    //                     }
    //                     else {
    //                         status = result[k].status;
    //                     }

    //                     this.match_detailcollection
    //                         .push({
    //                             "comp_id": result[k].comp_id,
    //                             "et_score": result[k].et_score,
    //                             "formatted_date": date,
    //                             "ft_score": result[k].ft_score,
    //                             "ht_score": result[k].ht_score,
    //                             "localteam_id": result[k].localteam_id,
    //                             "localteam_name": result[k].localteam_name,
    //                             "localteam_score": result[k].localteam_score,
    //                             "localteam_image": flag__loal,
    //                             "penalty_local": result[k].penalty_local,
    //                             "penalty_visitor": result[k].penalty_visitor,
    //                             "season": result[k].season,
    //                             "status": status,
    //                             "time": match_time,
    //                             "timer": result[k].timer,
    //                             "venue": result[k].venue,
    //                             "venue_city": result[k].venue_city,
    //                             "venue_id": result[k].venue_id,
    //                             "visitorteam_id": result[k].visitorteam_id,
    //                             "visitorteam_name": result[k].visitorteam_name,
    //                             "visitorteam_score": result[k].visitorteam_score,
    //                             "visitorteam_image": flag_visit,
    //                             "week": result[k].week,
    //                             "_id": result[k]._id,
    //                             "id": result[k].id,
    //                             "live_status": live_status
    //                         });

    //                     let events_data = result[k].events;
    //                     console.log("length_eee", events_data);
    //                     if (events_data !== undefined) {
    //                         for (var e = 0; e < events_data['length']; e++) {

    //                             let result_pipe_l = events_data[e].result.replace(']', '');
    //                             let result_pipe = result_pipe_l.replace('[', '');

    //                             let ic_event_penalty_scored = false;
    //                             let ic_event_own_goal = false;
    //                             let ic_event_goal = false;
    //                             var type = events_data[e].type;

    //                             if (type == "goal") {

    //                                 let player = events_data[e].player;
    //                                 if (player.includes("(pen.)")) {
    //                                     ic_event_penalty_scored = true;
    //                                 }
    //                                 else if (player.includes("(o.g.)")) {
    //                                     ic_event_own_goal = true;
    //                                 }
    //                                 else {
    //                                     ic_event_goal = true;
    //                                 }

    //                             }

    //                             this.events_collection
    //                                 .push({
    //                                     "id": events_data[e].id,
    //                                     "type": events_data[e].type,
    //                                     "minute": events_data[e].minute,
    //                                     "extra_min": events_data[e].extra_min,
    //                                     "team": events_data[e].team,
    //                                     "assist": events_data[e].assist,
    //                                     "assist_id": events_data[e].assist_id,
    //                                     "player": events_data[e].player,
    //                                     "player_id": events_data[e].player_id,
    //                                     "result": result_pipe,
    //                                     "ic_event_penalty_scored": ic_event_penalty_scored,
    //                                     "ic_event_own_goal": ic_event_own_goal,
    //                                     "ic_event_goal": ic_event_goal
    //                                 });
    //                         }
    //                     }

    //                 }
    //             }
    //         }

    //     });


    //     console.log("*********current_detail", this.match_detailcollection);
    //     console.log("*************current_event", this.events_collection);

    // }


    GetCommentariesByMatchId(current_matchId) {

        this.localteam_player_lineup = [];
        this.visitorteam_player_lineup = [];
        this.localteam_player_subs = [];
        this.visitorteam_player_subs = [];
        this.match_stats_collection = [];
        this.Commentary_collection = [];

        //this.match_detailcollection;
        console.log("match_id", current_matchId);

        this.matchService.GetCommentariesByMatchId(current_matchId).subscribe(data => {
            console.log("GetCommentariesByMatchId", data);

            var result = data['data'];

            if (result !== undefined) {
                for (var l = 0; l < result['length']; l++) {

                    let lineup = result[l].lineup;
                    let subs = result[l].subs;
                    let comments = result[l].comments;

                    //    localteam_lineup------------------------------------------------------------------------------------
                    let localteam_lineup = lineup['localteam'];

                    for (var lt = 0; lt < localteam_lineup['length']; lt++) {

                        var localteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_lineup[lt].id + ".jpg";



                        this.localteam_player_lineup.push({
                            "id": localteam_lineup[lt].id,
                            "name": localteam_lineup[lt].name,
                            "number": localteam_lineup[lt].number,
                            "pos": localteam_lineup[lt].pos,
                            "picture": localteamLinePlayer_url,

                        });
                    }
                    //   end localteam_lineup-----------------------------------------------------------------------------------


                    //    localteam_subs----------------------------------------------------------------------------------------

                    let localteam_subs = subs['localteam'];

                    for (var lts = 0; lts < localteam_subs['length']; lts++) {
                        var localteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_subs[lts].id + ".jpg";



                        this.localteam_player_subs.push({
                            "id": localteam_subs[lts].id,
                            "name": localteam_subs[lts].name,
                            "number": localteam_subs[lts].number,
                            "pos": localteam_subs[lts].pos,
                            "picture": localteamSubsPayer_url,


                        });
                    }
                    //  end  localteam_subs------------------------------------------------------------------------------------



                    //    visitorteam_lineup------------------------------------------------------------------------------------

                    let visitorteam_lineup = lineup['visitorteam'];

                    for (var vt = 0; vt < visitorteam_lineup['length']; vt++) {

                        var visitorteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_lineup[vt].id + ".jpg";



                        this.visitorteam_player_lineup.push({
                            "id": visitorteam_lineup[vt].id,
                            "name": visitorteam_lineup[vt].name,
                            "number": visitorteam_lineup[vt].number,
                            "pos": visitorteam_lineup[vt].pos,
                            "picture": visitorteamLinePlayer_url,
                        });
                    }
                    //  end visitorteam_lineup--------------------------------------------------------------------------------

                    //    visitorteam_subs------------------------------------------------------------------------------------

                    let visitorteam_subs = subs['visitorteam'];

                    for (var vts = 0; vts < visitorteam_subs['length']; vts++) {

                        var visitorteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_subs[vts].id + ".jpg";



                        this.visitorteam_player_subs.push({
                            "id": visitorteam_subs[vts].id,
                            "name": visitorteam_subs[vts].name,
                            "number": visitorteam_subs[vts].number,
                            "pos": visitorteam_subs[vts].pos,
                            "picture": visitorteamSubsPayer_url,
                        });
                    }
                    //  end visitorteam_subs------------------------------------------------------------------------------------







                    //  comments---------------------------------------------------------------------------------------

                    for (var c = 0; c < comments['length']; c++) {


                        let GoalType = false;
                        let isAssist = false;
                        let isSubstitution = false;
                        let downSubstitution = false;
                        let yellowcard = false;
                        let redcard = false;

                        let UpName = "";
                        let DownName = "";
                        let comment_icon = "";

                        let comment = comments[c].comment;
                        let important = comments[c].important;
                        let isgoal = comments[c].isgoal;
                        let minute = comments[c].minute

                        if (important == '1' && isgoal == '1') {

                            GoalType = true;
                            comment_icon = "assets/img/ic_goal.png";

                            let Substring1 = comment.split(".", 2);
                            let Substring2 = Substring1[1].split("-", 2);
                            UpName = Substring2[0];

                            //check 'Assist' is or not in given comment 
                            if (comment.includes("Assist")) {
                                isAssist = true;
                                let SubstringAssist = comment.split("Assist -", 2);
                                let assistName = SubstringAssist[1].split("with", 2);
                                DownName = assistName[0];
                            }
                        }
                        else {
                            //check 'Substitution' is or not in given comment
                            if (comment.includes("Substitution")) {

                                isSubstitution = true;
                                comment_icon = "assets/img/ic_sub_on_off_both2.png";


                                console.log("Substitution is found.");

                                let String1 = comment.split(".", 2);
                                let String2 = String1[1].split("for", 2);
                                let String3 = String2[1].split("-", 2);

                                UpName = String2[0];
                                DownName = String3[0];

                            }
                            if (comment.includes("yellow card")) {

                                yellowcard = true;
                                comment_icon = "assets/img/ic_yellow_card.png";

                                let String1_yc = comment.split("-", 2);

                                UpName = String1_yc[0];
                                DownName = "yellow card";

                            }
                            if (comment.includes("red card")) {

                                redcard = true;
                                comment_icon = "assets/img/ic_red_card.png";

                                let String1_rc = comment.split("-", 2);

                                UpName = String1_rc[0];
                                DownName = "red card";

                            }



                        }


                        this.Commentary_collection.push({
                            "GoalType": GoalType,
                            "isAssist": isAssist,
                            "isSubstitution": isSubstitution,
                            "downSubstitution": downSubstitution,
                            "yellowcard": yellowcard,
                            "redcard": redcard,
                            "upName": UpName,
                            "downName": DownName,
                            "comment": comment,
                            "minute": minute,
                            "icon": comment_icon
                        });


                    }

                    //  end comments------------------------------------------------------------------------------------



                    //    match_stats------------------------------------------------------------------------------------
                    let match_stats = result[l].match_stats;

                    let localteam_match_stats = match_stats['localteam'];
                    let visitorteam_match_stats = match_stats['visitorteam'];

                    //   lt for localteam && vt for visitorteam

                    for (var st = 0; st < localteam_match_stats['length']; st++) {
                        this.match_stats_collection.push({
                            "lt_corners": localteam_match_stats[st].corners,
                            "lt_fouls": localteam_match_stats[st].fouls,
                            "lt_offsides": localteam_match_stats[st].offsides,
                            "lt_possesiontime": localteam_match_stats[st].possesiontime,
                            "lt_redcards": localteam_match_stats[st].redcards,
                            "lt_saves": localteam_match_stats[st].saves,
                            "lt_shots_ongoal": localteam_match_stats[st].shots_ongoal,
                            "lt_shots_total": localteam_match_stats[st].shots_total,
                            "lt_yellowcards": localteam_match_stats[st].yellowcards,
                            "vt_corners": visitorteam_match_stats[st].corners,
                            "vt_fouls": visitorteam_match_stats[st].fouls,
                            "vt_offsides": visitorteam_match_stats[st].offsides,
                            "vt_possesiontime": visitorteam_match_stats[st].possesiontime,
                            "vt_redcards": visitorteam_match_stats[st].redcards,
                            "vt_saves": visitorteam_match_stats[st].saves,
                            "vt_shots_ongoal": visitorteam_match_stats[st].shots_ongoal,
                            "vt_shots_total": visitorteam_match_stats[st].shots_total,
                            "vt_yellowcards": visitorteam_match_stats[st].yellowcards
                        });

                    }
                    //  end  match_stats------------------------------------------------------------------------------------

                }
            }
        });


        console.log("localteam_player_lineup", this.localteam_player_lineup);
        console.log("visitorteam_player_lineup", this.visitorteam_player_lineup);
        console.log("localteam_player_subs", this.localteam_player_subs);
        console.log("visitorteam_player_subs", this.visitorteam_player_subs);


        console.log("Commentary_collection", this.Commentary_collection);


    }


    GetCommentariesByMatchId_live() {

        this.liveMatchesApiService.liveMatches().subscribe(data => {

            console.log("Live-Matches-data", data);

            var result = data['data'];

            console.log("Matches is Live comments", data);
            if (result.commentaries !== undefined) {

                var result_comments = data['data'].commentaries;

                if (this.id == result_comments['match_id']) {
                    this.localteam_player_lineup = [];
                    this.visitorteam_player_lineup = [];
                    this.localteam_player_subs = [];
                    this.visitorteam_player_subs = [];
                    this.match_stats_collection = [];
                    this.Commentary_collection = [];

                    let lineup = result_comments['lineup'];
                    let subs = result_comments['subs'];
                    let comments = result_comments['comments'];
                    //    localteam_lineup------------------------------------------------------------------------------------
                    let localteam_lineup = lineup['localteam'];

                    for (var lt = 0; lt < localteam_lineup['length']; lt++) {

                        var localteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_lineup[lt].id + ".jpg";



                        this.localteam_player_lineup.push({
                            "id": localteam_lineup[lt].id,
                            "name": localteam_lineup[lt].name,
                            "number": localteam_lineup[lt].number,
                            "pos": localteam_lineup[lt].pos,
                            "picture": localteamLinePlayer_url,

                        });
                    }
                    //   end localteam_lineup-----------------------------------------------------------------------------------


                    //    localteam_subs----------------------------------------------------------------------------------------

                    let localteam_subs = subs['localteam'];

                    for (var lts = 0; lts < localteam_subs['length']; lts++) {
                        var localteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_subs[lts].id + ".jpg";



                        this.localteam_player_subs.push({
                            "id": localteam_subs[lts].id,
                            "name": localteam_subs[lts].name,
                            "number": localteam_subs[lts].number,
                            "pos": localteam_subs[lts].pos,
                            "picture": localteamSubsPayer_url,


                        });
                    }
                    //  end  localteam_subs------------------------------------------------------------------------------------



                    //    visitorteam_lineup------------------------------------------------------------------------------------

                    let visitorteam_lineup = lineup['visitorteam'];

                    for (var vt = 0; vt < visitorteam_lineup['length']; vt++) {

                        var visitorteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_lineup[vt].id + ".jpg";


                        this.visitorteam_player_lineup.push({

                            "id": visitorteam_lineup[vt].id,
                            "name": visitorteam_lineup[vt].name,
                            "number": visitorteam_lineup[vt].number,
                            "pos": visitorteam_lineup[vt].pos,
                            "picture": visitorteamLinePlayer_url,
                        });
                    }
                    //  end visitorteam_lineup--------------------------------------------------------------------------------

                    //    visitorteam_subs------------------------------------------------------------------------------------

                    let visitorteam_subs = subs['visitorteam'];

                    for (var vts = 0; vts < visitorteam_subs['length']; vts++) {

                        var visitorteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_subs[vts].id + ".jpg";



                        this.visitorteam_player_subs.push({
                            "id": visitorteam_subs[vts].id,
                            "name": visitorteam_subs[vts].name,
                            "number": visitorteam_subs[vts].number,
                            "pos": visitorteam_subs[vts].pos,
                            "picture": visitorteamSubsPayer_url,
                        });
                    }
                    //  end visitorteam_subs------------------------------------------------------------------------------------




                    //  comments---------------------------------------------------------------------------------------

                    for (var c = 0; c < comments['length']; c++) {


                        let GoalType = false;
                        let isAssist = false;
                        let isSubstitution = false;
                        let downSubstitution = false;
                        let yellowcard = false;
                        let redcard = false;

                        let UpName = "";
                        let DownName = "";
                        let comment_icon = "";

                        let comment = comments[c].comment;
                        let important = comments[c].important;
                        let isgoal = comments[c].isgoal;
                        let minute = comments[c].minute

                        if (important == '1' && isgoal == '1') {

                            GoalType = true;
                            comment_icon = "assets/img/ic_goal.png";

                            let Substring1 = comment.split(".", 2);
                            let Substring2 = Substring1[1].split("-", 2);
                            UpName = Substring2[0];

                            //check 'Assist' is or not in given comment 
                            if (comment.includes("Assist")) {
                                isAssist = true;
                                let SubstringAssist = comment.split("Assist -", 2);
                                let assistName = SubstringAssist[1].split("with", 2);
                                DownName = assistName[0];
                            }
                        }
                        else {
                            //check 'Substitution' is or not in given comment
                            if (comment.includes("Substitution")) {

                                isSubstitution = true;
                                comment_icon = "assets/img/ic_sub_on_off_both2.png";


                                console.log("Substitution is found.");

                                let String1 = comment.split(".", 2);
                                let String2 = String1[1].split("for", 2);
                                let String3 = String2[1].split("-", 2);

                                UpName = String2[0];
                                DownName = String3[0];

                            }
                            if (comment.includes("yellow card")) {

                                yellowcard = true;
                                comment_icon = "assets/img/ic_yellow_card.png";

                                let String1_yc = comment.split("-", 2);

                                UpName = String1_yc[0];
                                DownName = "yellow card";

                            }
                            if (comment.includes("red card")) {

                                redcard = true;
                                comment_icon = "assets/img/ic_red_card.png";

                                let String1_rc = comment.split("-", 2);

                                UpName = String1_rc[0];
                                DownName = "red card";

                            }



                        }


                        this.Commentary_collection.push({
                            "GoalType": GoalType,
                            "isAssist": isAssist,
                            "isSubstitution": isSubstitution,
                            "downSubstitution": downSubstitution,
                            "yellowcard": yellowcard,
                            "redcard": redcard,
                            "upName": UpName,
                            "downName": DownName,
                            "comment": comment,
                            "minute": minute,
                            "icon": comment_icon
                        });




                    }

                    //  end comments------------------------------------------------------------------------------------


                    //    match_stats------------------------------------------------------------------------------------

                    let match_stats = result_comments['match_stats'];

                    let localteam_match_stats = match_stats['localteam'];
                    let visitorteam_match_stats = match_stats['visitorteam'];

                    //   lt for localteam && vt for visitorteam

                    for (var st = 0; st < localteam_match_stats['length']; st++) {
                        this.match_stats_collection.push({
                            "lt_corners": localteam_match_stats[st].corners,
                            "lt_fouls": localteam_match_stats[st].fouls,
                            "lt_offsides": localteam_match_stats[st].offsides,
                            "lt_possesiontime": localteam_match_stats[st].possesiontime,
                            "lt_redcards": localteam_match_stats[st].redcards,
                            "lt_saves": localteam_match_stats[st].saves,
                            "lt_shots_ongoal": localteam_match_stats[st].shots_ongoal,
                            "lt_shots_total": localteam_match_stats[st].shots_total,
                            "lt_yellowcards": localteam_match_stats[st].yellowcards,
                            "vt_corners": visitorteam_match_stats[st].corners,
                            "vt_fouls": visitorteam_match_stats[st].fouls,
                            "vt_offsides": visitorteam_match_stats[st].offsides,
                            "vt_possesiontime": visitorteam_match_stats[st].possesiontime,
                            "vt_redcards": visitorteam_match_stats[st].redcards,
                            "vt_saves": visitorteam_match_stats[st].saves,
                            "vt_shots_ongoal": visitorteam_match_stats[st].shots_ongoal,
                            "vt_shots_total": visitorteam_match_stats[st].shots_total,
                            "vt_yellowcards": visitorteam_match_stats[st].yellowcards
                        });

                    }
                    //  end  match_stats------------------------------------------------------------------------------------
                }

            }


        });


    }


    //NEW 

    GetMatchDeatilByMatchId(match_id) {
        this.match_detailcollection = [];
        this.events_collection = [];
        this.localteam_player_lineup = [];
        this.visitorteam_player_lineup = [];
        this.localteam_player_subs = [];
        this.visitorteam_player_subs = [];
        this.match_stats_collection = [];
        this.Commentary_collection = [];
        this.matchService.GetMatchDeatilByMatchId(match_id).subscribe(data => {
            console.log("GetMatchDeatilByMatchId", data);
            var result = data['data'];

            if (result !== undefined) {

                console.log("--------------------");
                console.log("data", result)

                this.status = result['status'];

                for (var k = 0; k < result.length; k++) {


                    if (result[k].id == this.id) {

                        console.log("current page data", result[k]);

                        let date_formatted = result[k].formatted_date.replace('.', '/');
                        let date = date_formatted.replace('.', '/');

                        //Change UTC timezone to IST(Local)
                        var myString = result[k].formatted_date;

                        var fulldate = this.jsCustomeFun.SpliteStrDateFormat(myString);


                        //Change UTC timezone to IST(Local)
                        let timezone = fulldate + " " + result[k].time;
                        let match_time = this.jsCustomeFun.ChangeTimeZone(timezone);

                        console.log("time ", match_time);

                        //let current_matchId = result[0].id;
                        //  this.GetCommentariesByMatchId(current_matchId);

                        var flag__loal = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[k].localteam_id + ".png";
                        var flag_visit = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/teamsNew/" + result[k].visitorteam_id + ".png";



                        console.log(":Matches tiem:", match_time);
                        let live_status = this.jsCustomeFun.CompareTimeDate(match_time);

                        var status;
                        if (result[k].status == "") {
                            status = match_time;
                        }
                        else {
                            status = result[k].status;
                        }

                        this.match_detailcollection
                            .push({
                                "comp_id": result[k].comp_id,
                                "et_score": result[k].et_score,
                                "formatted_date": date,
                                "ft_score": result[k].ft_score,
                                "ht_score": result[k].ht_score,
                                "localteam_id": result[k].localteam_id,
                                "localteam_name": result[k].localteam_name,
                                "localteam_score": result[k].localteam_score,
                                "localteam_image": flag__loal,
                                "penalty_local": result[k].penalty_local,
                                "penalty_visitor": result[k].penalty_visitor,
                                "season": result[k].season,
                                "status": status,
                                "time": match_time,
                                "timer": result[k].timer,
                                "venue": result[k].venue,
                                "venue_city": result[k].venue_city,
                                "venue_id": result[k].venue_id,
                                "visitorteam_id": result[k].visitorteam_id,
                                "visitorteam_name": result[k].visitorteam_name,
                                "visitorteam_score": result[k].visitorteam_score,
                                "visitorteam_image": flag_visit,
                                "week": result[k].week,
                                "_id": result[k]._id,
                                "id": result[k].id,
                                "live_status": live_status
                            });

                        let events_data = result[k].events;
                        console.log("length_eee", events_data);
                        if (events_data !== undefined) {
                            for (var e = 0; e < events_data['length']; e++) {

                                let result_pipe_l = events_data[e].result.replace(']', '');
                                let result_pipe = result_pipe_l.replace('[', '');

                                let ic_event_penalty_scored = false;
                                let ic_event_own_goal = false;
                                let ic_event_goal = false;
                                var type = events_data[e].type;

                                if (type == "goal") {

                                    let player = events_data[e].player;
                                    if (player.includes("(pen.)")) {
                                        ic_event_penalty_scored = true;
                                    }
                                    else if (player.includes("(o.g.)")) {
                                        ic_event_own_goal = true;
                                    }
                                    else {
                                        ic_event_goal = true;
                                    }

                                }

                                this.events_collection
                                    .push({
                                        "id": events_data[e].id,
                                        "type": events_data[e].type,
                                        "minute": events_data[e].minute,
                                        "extra_min": events_data[e].extra_min,
                                        "team": events_data[e].team,
                                        "assist": events_data[e].assist,
                                        "assist_id": events_data[e].assist_id,
                                        "player": events_data[e].player,
                                        "player_id": events_data[e].player_id,
                                        "result": result_pipe,
                                        "ic_event_penalty_scored": ic_event_penalty_scored,
                                        "ic_event_own_goal": ic_event_own_goal,
                                        "ic_event_goal": ic_event_goal
                                    });
                            }
                        }


                        var commentaries = result[k].commentaries;
                        for (let l = 0; l < commentaries['length']; l++) {

                            if (commentaries[l].match_id == this.id) {
                                let lineup = commentaries[l].lineup;
                                let subs = commentaries[l].subs;
                                let comments = commentaries[l].comments;

                                //    localteam_lineup------------------------------------------------------------------------------------
                                let localteam_lineup = lineup['localteam'];

                                console.log("1055", localteam_lineup);
                                
                                if(localteam_lineup == !null){

                                for (var lt = 0; lt < localteam_lineup['length']; lt++) {

                                    var localteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_lineup[lt].id + ".jpg";

                                    this.localteam_player_lineup.push({
                                        "id": localteam_lineup[lt].id,
                                        "name": localteam_lineup[lt].name,
                                        "number": localteam_lineup[lt].number,
                                        "pos": localteam_lineup[lt].pos,
                                        "picture": localteamLinePlayer_url,

                                    });
                                }
                            }
                                //   end localteam_lineup-----------------------------------------------------------------------------------


                                //    localteam_subs----------------------------------------------------------------------------------------

                                let localteam_subs = subs['localteam'];

                                if(localteam_subs == !null){
                                for (var lts = 0; lts < localteam_subs['length']; lts++) {
                                    var localteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + localteam_subs[lts].id + ".jpg";
                                    this.localteam_player_subs.push({
                                        "id": localteam_subs[lts].id,
                                        "name": localteam_subs[lts].name,
                                        "number": localteam_subs[lts].number,
                                        "pos": localteam_subs[lts].pos,
                                        "picture": localteamSubsPayer_url,
                                    });
                                }
                            }
                                //  end  localteam_subs------------------------------------------------------------------------------------



                                //    visitorteam_lineup------------------------------------------------------------------------------------

                                let visitorteam_lineup = lineup['visitorteam'];
                                if(visitorteam_lineup == !null){

                                for (var vt = 0; vt < visitorteam_lineup['length']; vt++) {

                                    var visitorteamLinePlayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_lineup[vt].id + ".jpg";


                                    this.visitorteam_player_lineup.push({
                                        "id": visitorteam_lineup[vt].id,
                                        "name": visitorteam_lineup[vt].name,
                                        "number": visitorteam_lineup[vt].number,
                                        "pos": visitorteam_lineup[vt].pos,
                                        "picture": visitorteamLinePlayer_url,
                                    });
                                }
                            }
                                //  end visitorteam_lineup--------------------------------------------------------------------------------

                                //    visitorteam_subs------------------------------------------------------------------------------------

                                let visitorteam_subs = subs['visitorteam'];
                                if(visitorteam_subs == !null){
                                for (var vts = 0; vts < visitorteam_subs['length']; vts++) {

                                    var visitorteamSubsPayer_url = "https://s3.ap-south-1.amazonaws.com/tuppleapps/fifa18images/players/" + visitorteam_subs[vts].id + ".jpg";



                                    this.visitorteam_player_subs.push({
                                        "id": visitorteam_subs[vts].id,
                                        "name": visitorteam_subs[vts].name,
                                        "number": visitorteam_subs[vts].number,
                                        "pos": visitorteam_subs[vts].pos,
                                        "picture": visitorteamSubsPayer_url,
                                    });
                                }
                            }
                                //  end visitorteam_subs------------------------------------------------------------------------------------







                                //  comments---------------------------------------------------------------------------------------

                                for (var c = 0; c < comments['length']; c++) {


                                    let GoalType = false;
                                    let isAssist = false;
                                    let isSubstitution = false;
                                    let downSubstitution = false;
                                    let yellowcard = false;
                                    let redcard = false;

                                    let UpName = "";
                                    let DownName = "";
                                    let comment_icon = "";

                                    let comment = comments[c].comment;
                                    let important = comments[c].important;
                                    let isgoal = comments[c].isgoal;
                                    let minute = comments[c].minute

                                    if (important == '1' && isgoal == '1') {

                                        GoalType = true;
                                        comment_icon = "assets/img/ic_goal.png";

                                        let Substring1 = comment.split(".", 2);
                                        let Substring2 = Substring1[1].split("-", 2);
                                        UpName = Substring2[0];

                                        //check 'Assist' is or not in given comment 
                                        if (comment.includes("Assist")) {
                                            isAssist = true;
                                            let SubstringAssist = comment.split("Assist -", 2);
                                            let assistName = SubstringAssist[1].split("with", 2);
                                            DownName = assistName[0];
                                        }
                                    }
                                    else {
                                        //check 'Substitution' is or not in given comment
                                        if (comment.includes("Substitution")) {

                                            isSubstitution = true;
                                            comment_icon = "assets/img/ic_sub_on_off_both2.png";


                                            console.log("Substitution is found.");

                                            let String1 = comment.split(".", 2);
                                            let String2 = String1[1].split("for", 2);
                                            let String3 = String2[1].split("-", 2);

                                            UpName = String2[0];
                                            DownName = String3[0];

                                        }
                                        if (comment.includes("yellow card")) {

                                            yellowcard = true;
                                            comment_icon = "assets/img/ic_yellow_card.png";

                                            let String1_yc = comment.split("-", 2);

                                            UpName = String1_yc[0];
                                            DownName = "yellow card";

                                        }
                                        if (comment.includes("red card")) {

                                            redcard = true;
                                            comment_icon = "assets/img/ic_red_card.png";

                                            let String1_rc = comment.split("-", 2);

                                            UpName = String1_rc[0];
                                            DownName = "red card";

                                        }



                                    }


                                    this.Commentary_collection.push({
                                        "GoalType": GoalType,
                                        "isAssist": isAssist,
                                        "isSubstitution": isSubstitution,
                                        "downSubstitution": downSubstitution,
                                        "yellowcard": yellowcard,
                                        "redcard": redcard,
                                        "upName": UpName,
                                        "downName": DownName,
                                        "comment": comment,
                                        "minute": minute,
                                        "icon": comment_icon
                                    });


                                }

                                //  end comments------------------------------------------------------------------------------------



                                //    match_stats------------------------------------------------------------------------------------
                                let match_stats = commentaries[l].match_stats;

                                let localteam_match_stats = match_stats['localteam'];
                                let visitorteam_match_stats = match_stats['visitorteam'];

                                //   lt for localteam && vt for visitorteam
                                if(localteam_match_stats == !null && visitorteam_match_stats == !null){
                                for (var st = 0; st < localteam_match_stats['length']; st++) {
                                    this.match_stats_collection.push({
                                        "lt_corners": localteam_match_stats[st].corners,
                                        "lt_fouls": localteam_match_stats[st].fouls,
                                        "lt_offsides": localteam_match_stats[st].offsides,
                                        "lt_possesiontime": localteam_match_stats[st].possesiontime,
                                        "lt_redcards": localteam_match_stats[st].redcards,
                                        "lt_saves": localteam_match_stats[st].saves,
                                        "lt_shots_ongoal": localteam_match_stats[st].shots_ongoal,
                                        "lt_shots_total": localteam_match_stats[st].shots_total,
                                        "lt_yellowcards": localteam_match_stats[st].yellowcards,
                                        "vt_corners": visitorteam_match_stats[st].corners,
                                        "vt_fouls": visitorteam_match_stats[st].fouls,
                                        "vt_offsides": visitorteam_match_stats[st].offsides,
                                        "vt_possesiontime": visitorteam_match_stats[st].possesiontime,
                                        "vt_redcards": visitorteam_match_stats[st].redcards,
                                        "vt_saves": visitorteam_match_stats[st].saves,
                                        "vt_shots_ongoal": visitorteam_match_stats[st].shots_ongoal,
                                        "vt_shots_total": visitorteam_match_stats[st].shots_total,
                                        "vt_yellowcards": visitorteam_match_stats[st].yellowcards
                                    });

                                }
                            }
                                //  end  match_stats------------------------------------------------------------------------------------
                            }

                        }
                    }
                }
            }
        });
    }

    Playerdetails(player_id) {
        this.router.navigate(['/player', player_id]);
    }


    gotomatch() {
        let selectedId = this.id ? this.id : null;
        this.router.navigate(['../', { id: selectedId }], { relativeTo: this.route })
    }


    teamdetails(team_id) {
        this.router.navigate(['/team', team_id]);
    }


    ImgError(source) {
        console.log("image not load on error src", source);

        source.src = "assets/img/avt_flag.jpg";
        source.onerror = "";
        return true;

        //return  "assets/images/my-image.png";
    }

}
