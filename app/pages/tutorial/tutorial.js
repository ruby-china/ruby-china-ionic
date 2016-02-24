import {Page, NavController, MenuController} from 'ionic-framework/ionic';
import {Inject} from 'angular2/core';
import {TopicsPage} from "../topics/topics";

@Page({
  templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {
  static get parameters() {
    return [[NavController], [MenuController]]
  }
  constructor(nav, menu) {
    this.nav = nav;
    this.menu = menu;
    this.showSkip = true;

    this.slides = [
      {
        image: "img/ica-slidebox-img-1.png",
        title: "RubyChina App 2",
        desc: "体验新版 RubyChina App"
      },
      {
        image: "img/ica-slidebox-img-4.png",
        title: "采用 Ionic 2",
        desc: "新版采用 Ionic 2 开发"
      }
    ]
  }

  skipTutorial() {
    this.nav.setRoot(TopicsPage, { type: "last_actived" });
  }

  onPageDidEnter() {
    // the left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  onPageDidLeave() {
    // enable the left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
