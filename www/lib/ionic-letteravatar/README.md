# ionic-letter-avatar <a href="http://uttesh.github.io/ionic-letteravatar">Demo</a>

AngularJS directive for simple data avatar like gmail/inbox. 

## Quick start

```
bower install ionic-letter-avatar
```


or alternatively download and include `ionic-letteravatar.js` after `angular.min.js`.

Add the `ionic-letter-avatar` module as a dependency when creating your app, e.g.

```
var app = angular.module('myApp', ['ionic-letter-avatar']);`
```

NO NEED TO INJECT in controller directly use in html.

## Rendering


```
  <ionic-letter-avatar data="a"></ionic-letter-avatar>
```

## Option attirbutes

You can affect how letteravatar operates with the following settings:

name | default | description
-----|---------|------------
`charcount` | 1 | Specifies the number letters to displayed.
`data` |  | input data
`height` | 50px | set the height for the avatar
`width` | 50px | set the width for the avatar
`fontweight` | 400 | set the font weight for the  avatar
`fontsize` | 30px | set the font size for the letter
`shape` | square  | set the shape for the avatar. set 'round' for rounded avatars
`fontfamily` | HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif | set the font Family of the avatar.
`avatarborder` | false | set the avatarborder to 'true' for the white border to avatar.
`avatarcustomborder` | no default value | using this attribute set the custom style to avatar borders i.e <code> "border:5px solid black"</code>.

## Contributions

For problems/suggestions please create an issue on Github.

## Contributors

* [@uttesh](https://twitter.com/uttesh)

# License

The MIT License

Copyright (c) 2015 Uttesh Kumar T.H. http://www.uttesh.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

