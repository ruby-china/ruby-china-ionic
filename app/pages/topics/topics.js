import {CORE_DIRECTIVES} from "angular2/common";
import {Page, NavController, MenuController, NavParams} from 'ionic-framework/ionic';
import {TopicService} from "../../services/topic.service";

import {TopicPage} from "../topic/topic";

@Page({
  templateUrl: "build/pages/topics/topics.html",
  directives: [CORE_DIRECTIVES],
  providers: [TopicService]
})
export class TopicsPage {
  static get parameters() {
    return [[NavController], [MenuController], [TopicService], [NavParams]];
  }
  constructor(nav, menu, service, navParams) {
    this.nav = nav;
    this.menu = menu;
    this.navParams = navParams;
    let type = this.navParams.get("type");
    service.getTopicsDefault(type)
      .subscribe(res => {
        // console.info(res.topics);
        this.topics = res.topics;
      });
  }

  navTopicDetail(topic) {
    this.nav.push(TopicPage, {topicParams: topic});
  }

  onPageDidEnter() {
    this.menu.swipeEnable(false);
  }
}
