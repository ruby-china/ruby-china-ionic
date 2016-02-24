import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';
import {TopicService} from "../../services/topic.service";
import {TopicPage} from "../topic/topic";

@Page({
  templateUrl: "build/pages/topics/topics.html"
})
export class TopicsPage {
  static get parameters() {
    return [[NavController], [TopicService], [NavParams]];
  }
  constructor(nav, service, navParams) {
    this.nav = nav;
    this.service = service;
    this.navParams = navParams;
    let type = this.navParams.get("type");
    this.updateTopics(type);
  }

  updateTopics(type) {
    this.service.loadTopics(type)
      .then(data => {
        this.topics =
          data.topics.map(topic => {
            topic._created_at = new Date(topic.created_at);
            // console.info(topic);
            return topic;
          });
      });
  }

  navTopicDetail(topic) {
    this.nav.push(TopicPage, topic);
  }
}
