import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class TopicService {

  constructor(public http: Http) {
    // console.info('Topic Service worked.', http);
  }

  getTopicsDefault() {
    return this.http.get("https://ruby-china.org/api/v3/topics.json")
      .map(res => res.json())
      .catch(err => {
        this.handleError(err);
        return Observable.throw(err.json());
      });
  }

  handleError(err) {
    console.log('handleError in service - err = ' + err);
  }
}
