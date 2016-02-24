import {CORE_DIRECTIVES} from "angular2/common";
import {Page, NavParams} from 'ionic-framework/ionic';

@Page({
  templateUrl: "build/pages/topic/topic.html",
  directives: [CORE_DIRECTIVES]
})
export class TopicPage {
  static get parameters() {
    return [[NavParams]];
  }
  constructor(navParams) {
    this.topic = navParams.get("topicParams");
  }
}
