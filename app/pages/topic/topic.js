import { Page, MenuController, NavParams, ViewController } from 'ionic-framework/ionic';
import { Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from "angular2/common";
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { TopicService } from "../../services/topic.service";

@Page({
  templateUrl: "build/pages/topic/topic.html",
  pipes: [DateFormatPipe],
  directives: [CORE_DIRECTIVES]
})
export class TopicPage {
  static get parameters() {
    return [
      [TopicService],
      [NavParams],
      [MenuController],
      [ViewController]
    ];
  }
  constructor(service, navParams, menu, view) {
    this.service = service;
    this.navParams = navParams;
    this.menu = menu;
    this.view = view;
    this.topic = this.navParams.data;
    this.loaded = false;

    this.updateTopic(this.navParams.data.id);
  }

  updateTopic(id) {
    this.service.loadTopic(id)
      .then(data => {
        this.topic = data.topic;
        this.topic._created_at = new Date(this.topic.created_at);
        this.updateTopicReplies(id);
      });
  }

  updateTopicReplies(id) {
    this.service.loadTopicReplies(id)
      .then(data => {
        this.replies = data.replies;
        // console.info(this.replies);
        this.loaded = true;
      });
  }

  onPageWillEnter() {
    this.view.setBackButtonText('');
  }

  onPageLoaded() {
    this.menu.swipeEnable(false);
  }

  onPageDidLeave() {
    this.menu.swipeEnable(true);
  }
}
