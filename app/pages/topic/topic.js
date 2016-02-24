import {Page, MenuController, NavParams} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';
import {CORE_DIRECTIVES} from "angular2/common";
import {TopicService} from "../../services/topic.service";

@Page({
  templateUrl: "build/pages/topic/topic.html",
  directives: [CORE_DIRECTIVES]
})
export class TopicPage {
  static get parameters() {
    return [[TopicService], [NavParams], [MenuController]];
  }
  constructor(service, navParams, menu) {
    this.service = service;
    this.navParams = navParams;
    this.menu = menu;
    this.topic = this.navParams.data;
    this.loaded = false;
    this.updateTopic(this.navParams.data.id);
  }

  updateTopic(id) {
    this.service.loadTopic(id)
      .then(data => {
        this.topic = data.topic;
        this.loaded = true;
      });
  }

  onPageLoaded() {
    this.menu.swipeEnable(false);
  }

  onPageWillLeave() {
    this.menu.swipeEnable(true);
  }
}
