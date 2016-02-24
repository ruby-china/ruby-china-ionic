import {CORE_DIRECTIVES} from "angular2/common";
import {Page} from 'ionic-framework/ionic';
import {Topic} from "../components/topic/components/topic";
import {TopicService} from "../components/topic/services/topic.service";

@Page({
  templateUrl: "build/pages/topics/topics.page.html",
  directives: [Topic, CORE_DIRECTIVES],
  providers: [TopicService]
})
export class TopicsPage {
  topics: Object[];
  constructor(
    _service: TopicService
  ) {
    _service.getTopicsDefault()
      .subscribe(res => {
        console.info(res.topics);
        this.topics = res.topics;
      });
  }
}
