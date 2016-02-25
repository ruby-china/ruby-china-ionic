import {Page, NavController, NavParams, MenuController} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';
import {TopicService} from "../../services/topic.service";
import {TopicPage} from "../topic/topic";

@Page({
  templateUrl: "build/pages/topics/topics.html"
})
export class TopicsPage {
  static get parameters() {
    return [[NavController], [TopicService], [NavParams], [MenuController]];
  }
  constructor(nav, service, navParams, menu) {
    this.nav = nav;
    this.service = service;
    this.navParams = navParams;
    this.menu = menu;
    let type = this.navParams.get("type");
    this.updateTopics(type);
  }

  updateTopics(type) {
    this.service.loadTopics(type)
      .then(data => {
        // console.info(data.topics);
        this.topics = data.topics;
      });
  }

  navTopicDetail(topic) {
    this.nav.push(TopicPage, topic);
  }

  onPageLoaded() {
    this.menu.swipeEnable(true);
  }
}
