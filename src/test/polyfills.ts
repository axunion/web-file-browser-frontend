// jsdom exposes `style.animation` but not `AnimationEvent`, which makes React
// listen for `webkitAnimationEnd` instead of `animationend`. React picks the
// event name when react-dom loads, so this must run before any setup file
// that imports it.
if (!("AnimationEvent" in window)) {
  class AnimationEvent extends Event {
    readonly animationName: string;
    readonly elapsedTime: number;
    readonly pseudoElement: string;

    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init);
      this.animationName = init.animationName ?? "";
      this.elapsedTime = init.elapsedTime ?? 0;
      this.pseudoElement = init.pseudoElement ?? "";
    }
  }
  Object.assign(window, { AnimationEvent });
}
