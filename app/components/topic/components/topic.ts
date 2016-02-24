import {Component, Input} from "angular2/core";

@Component({
  selector: 'topic',
  template: `
    <h2>{{ topic.title }}</h2>
    <div class="info">{{ topic.node_name }} <span class="author">{{ topic.user.login }}</span></div>
  `
})

export class Topic {
  @Input() topic;
}
