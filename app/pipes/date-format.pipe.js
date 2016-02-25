import { Pipe } from "angular2/core";
import moment from 'moment';

@Pipe({
  name: 'dateFormat',
  pure: false
})
export class DateFormatPipe {

  // 可以对日期类型或者日期字符串进行转换
  transform(value, [formatter]) {
    if (!value) {
      return;
    }
    var df;
    if (this.isString(value)) {
      value = new Date(value);
    }
    if (this.isDate(value)) {
      df = moment(value).format(formatter);
    }
    return df;
  }

  isDate(input) {
    return input instanceof Date ||
      Object.prototype.toString.call(input) === '[object Date]' ||
      input.toString() !== "Invalid Date";
  }

  isString(input) {
    return input instanceof String || Object.prototype.toString.call(input) === '[Object String]';
  }
}
