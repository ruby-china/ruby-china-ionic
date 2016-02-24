import {CORE_DIRECTIVES} from "angular2/common";
import {Page, NavController, MenuController} from 'ionic-framework/ionic';
import {TopicService} from "../../services/topic.service";

import {TopicPage} from "../topic/topic.page";

@Page({
  templateUrl: "build/pages/topics/topics.page.html",
  directives: [CORE_DIRECTIVES],
  providers: [TopicService]
})
export class TopicsPage {
  topics: Object[];
  constructor(
    private menu: MenuController,
    private _service: TopicService,
    public nav: NavController
  ) {
    _service.getTopicsDefault()
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
