import { Page, NavController, NavParams, MenuController, ViewController } from 'ionic-framework/ionic';
import { Inject } from 'angular2/core';
import { WeberService } from "../../services/weber.service";

@Page({
  templateUrl: "build/pages/webview/webview.html"
})
export class WebviewPage {
  static get parameters() {
    return [[NavController], 
    [NavParams], [MenuController], [WeberService], [ViewController]];
  }
  constructor(nav, navParams, menu, service, view) {
    this.nav = nav;
    this.navParams = navParams;
    this.menu = menu;
    this.service = service;
    this.view = view;

    this.webUrl = navParams.data;
    // this.updateWeb(url);
  }

  updateWeb(url) {
    this.service.getResponseByUrl(url)
      .then(data => {
        console.info(data);
      });
  }

  onPageWillEnter() {
    this.view.setBackButtonText('');
  }

}
