import { Injectable, Inject } from "angular2/core";
import { Http } from "angular2/http";

@Injectable()
export class WeberService {
  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  // 根据 URL 地址返回 responseText
  getResponseByUrl(url) {
    // debugger;
    return new Promise(resolve => {
      this.http.get(url)
        .subscribe(res => {
          resolve(res.text());
        });
    });
  }

}