import ws from "ws"

export default class WebSocket {
  private WebSocket: ws | null

  constructor() {
    this.WebSocket = null
  }
}
