import { Pipe } from "angular2/core";

@Pipe({
  name: 'exlink',
  pure: true
})
export class ExlinkPipe {
  transform(value) {
    return String(value)
      .replace(/href=/gm, "class=\"ex-link\" data-url=");
  }
}