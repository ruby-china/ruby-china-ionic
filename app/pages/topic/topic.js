import { Page, MenuController, NavController, NavParams, ViewController } from 'ionic-framework/ionic';
import { Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from "angular2/common";
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { ExlinkPipe } from "../../pipes/exlink.pipe";
import { TopicService } from "../../services/topic.service";
import { WeberService } from "../../services/weber.service";
import { WebviewPage } from "../../pages/webview/webview";
import * as $ from "jquery";

@Page({
  templateUrl: "build/pages/topic/topic.html",
  pipes: [DateFormatPipe, ExlinkPipe],
  directives: [CORE_DIRECTIVES]
})
export class TopicPage {
  static get parameters() {
    return [[TopicService], [WeberService], [NavController], [NavParams], [MenuController], [ViewController]];
  }
  constructor(service, weber, nav, navParams, menu, view, ele) {
    this.service = service;
    this.weber = weber;
    this.nav = nav;
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
        setTimeout(() => {
          this.formatExlinks();
        }, 0)
      });
  }

  formatExlinks() {
    let exlinks = $.find(".ex-link");
    // debugger;
    exlinks.map(link => {
      let url = $.attr(link, "data-url");
      link.onclick = () => {
        this.openUrl(url);
        return false;
      };
      return link;
    });
  }

  openUrl(url) {
    // debugger;
    this.nav.push(WebviewPage, url);
  }

  onPageWillEnter() {
    this.view.setBackButtonText('');
  }

  onPageLoaded() {
    this.menu.swipeEnable(false);
  }
}
