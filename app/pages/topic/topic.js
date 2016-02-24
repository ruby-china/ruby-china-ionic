import {Page, MenuController, NavParams} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';

@Page({
  templateUrl: "build/pages/topic/topic.html"
})
export class TopicPage {
  static get parameters() {
    return [[NavParams], [MenuController]];
  }
  constructor(navParams, menu) {
    this.navParams = navParams;
    this.menu = menu;
    this.topic = navParams.data;
  }

  onPageLoaded() {
    this.menu.swipeEnable(false);
  }
  
  onPageWillLeave() {
    this.menu.swipeEnable(true);
  }
}
