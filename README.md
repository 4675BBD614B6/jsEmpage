# jsEmpage
Embed another page with cross-frame function calls

# Usage
On the host page through a user script:
```js
// @require     https://cdn.jsdelivr.net/gh/4675BBD614B6/jsEmpage/index.min.js

let empage = new JsEmpage("https://example.com"); // width, height are optional
empage.addRPC("singleLambda", function() {});
empage.addRPC({
  testAlert: (arg0) => alert(arg0),
  // multiple allowed
});
```
From the page that is being put in a frame:
```js
const invoke = (rpc, ...args) => window.parent.postMessage(["JsEmpage-RPC", rpc, ...args], "*");

invoke("testAlert", "hello);
```

# Example Idea
- Injecting controls onto another page

# Notes
- This should work outside of a user script.
- The `onClose` property can be overriden to change the behaviour of the close button
