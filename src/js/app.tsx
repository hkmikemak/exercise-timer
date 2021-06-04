import ReactDOM from "react-dom";

import { AppComponent } from "components/AppComponent";

ReactDOM.render(<AppComponent />, document.body);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
