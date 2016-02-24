import {Injectable, Inject} from "angular2/core";
import {Http} from "angular2/http";

@Injectable()
export class TopicService {
  static get parameters() {
    return [[Http]];
  }
  constructor(http) {
    this.http = http;
    // console.info('Topic Service worked.', http);
  }

  // 按类型载入帖子列表
  loadTopics(type) {
    let url = "https://ruby-china.org/api/v3/topics.json?type=" + type;
    return this.load(url);
  }

  // 根据 ID 载入帖子
  loadTopic(id) {
    let url = "https://ruby-china.org/api/v3/topics/" + id + ".json";
    return this.load(url);
  }

  // 根据 URL 载入数据
  load(url) {
    return new Promise(resolve => {
      this.http.get(url)
        .subscribe(res => {
          this.data = res.json();
          resolve(this.data);
        });
    });
  }
}
