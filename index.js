class JsEmpage {
  rpcs = {};
  element;
  iframe;

  onClose = () => this.destroy();

  constructor(url, width = "200px", height = "150px") {
    window.addEventListener('message', this.#onMessage);

    let makeElement = (type, style) => {
      let element = document.createElement(type);
      Object.assign(element.style, style);
      return element;
    }

    this.element = makeElement("div", {
      position: "fixed",
      zIndex: 65535,
      bottom: "10px", right: "10px",
      margin: 0, padding: 0,
      backgroundColor: "#555"
    });
    this.resize(width, height);
    this.#dragElement(this.element);

    let close = makeElement("div", {
      position: "absolute",
      top: "1px", right: "1px", width: "14px", height: "14px",
      margin: 0, padding: 0,
      backgroundColor: "red"
    });
    close.onclick = () => this.onClose();
    this.element.appendChild(close);

    this.iframe = makeElement("iframe", {
      position: "relative",
      top: "16px", left: "0px", width: "100%", height: "calc(100% - 16px)",
      margin: 0, padding: 0,
      border: "none",
    });
    this.iframe.src = url;
    this.element.appendChild(this.iframe);

    document.body.appendChild(this.element);
  }

  destroy() {
    window.removeEventListener("message", this.#onMessage);
    this.element.parentNode.removeChild(this.element)
  }

  resize(width, height) {
    this.element.style.width = width;
    this.element.style.height = `calc(${height} + 16px)`;
  }

  addRPC(a, b = null) {
    if (typeof a == "string") {
      let rpc = {}
      rpc[a] = b;
      this.#addRPC(rpc);
    } else this.#addRPC(a);
  }

  #addRPC(rpc) {
    if (!rpc) return;
    this.rpcs = {...this.rpcs, ...rpc};
  }

  // TODO: only allow messages from iframe
  #onMessage(e) {
    if (!Array.isArray(e.data)) return;
    if (e.data[0] != "JsEmpage-RPC") return;
    if (!(e.data[1] in this.rpcs)) return console.warn("Non-existant Empage RPC: " + e.data[1]);
    let rpc = this.rpcs[e.data[1]]
    if (typeof rpc != "function") return console.error("RPC is not a function: " + e.data[1]);
    rpc(e.data.splice(2));
  }

  #dragElement(element) {
    let x, y;

    element.onmousedown = e => {
      e.preventDefault();
      [x, y] = [e.clientX, e.clientY];

      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
    }

    function onMouseUp() {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(e) {
      e.preventDefault();
      let _x = x - e.clientX;
      let _y = y - e.clientY;
      x = e.clientX;
      y = e.clientY;
      element.style.top = (element.offsetTop - _y) + "px";
      element.style.left = (element.offsetLeft - _x) + "px";
    }
  }
}
