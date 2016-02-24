import {App, IonicApp, Platform} from 'ionic-framework/ionic';
import {TutorialPage} from './pages/tutorial/tutorial';
import {TopicsPage} from './pages/topics/topics';
import {TopicService} from "./services/topic.service";

@App({
  templateUrl: 'build/app.html',
  providers: [TopicService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class RubyChinaApp {
  static get parameters() {
    return [[IonicApp], [Platform], [TopicService]];
  }

  constructor(app, platform, service) {
    this.app = app;
    this.platform = platform;
    this.rootPage = TutorialPage;
    this.appPages = [
      { title: "讨论区", component: TopicsPage, type: "last_actived"  },
      { title: "优质帖子", component: TopicsPage, type: "excellent" }
    ];

    // load topics
    service.loadTopics("last_actived");
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Keyboard.setAccessoryBarVisible(false);
  //     // StatusBar.setStyle(1);
  //   });
  // }

  openPage(page) {
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component, { type: page.type });
  }
}
