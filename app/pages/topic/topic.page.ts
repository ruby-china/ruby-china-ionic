import {CORE_DIRECTIVES} from "angular2/common";
import {Page, NavParams} from 'ionic-framework/ionic';

@Page({
  templateUrl: "build/pages/topic/topic.page.html",
  directives: [CORE_DIRECTIVES]
})
export class TopicPage {
  topic: Object;
  constructor(
    public navParams: NavParams
  ) {
    this.topic = navParams.get("topicParams");
  }
}
