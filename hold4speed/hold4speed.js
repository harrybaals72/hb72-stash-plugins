// see README for shortcuts

/*
// ,. will override stash commands when focused on video
. - when paused, step forward one frame
, - when paused, step back one frame
> - speed up playback rate
< - slow down playback rate
c - activate/ deactivate captions
*/

// declarations
let player, framestep;
let markers = [];

wfke("video-js", init);

function handleKeyUp(evt) {
  const key = evt.key;
  if (key == "b" || key == "c" || key == "v") {
    player.playbackRate(1);
    evt.preventDefault();
  }
}

function handleKey(evt) {
  const key = evt.key;
  
  // speed up playback rate (hold 'b' for 2x)
  if (key == "b") {
    player.playbackRate(4);
    evt.preventDefault();
  }
  // c - speed up playback rate (hold 'c' for 8x)
  else if (key == "c") {
    player.playbackRate(8);
    evt.preventDefault();
  }
  // v - speed up playback rate (hold 'v' for 16x)
  else if (key == "v") {
    player.playbackRate(16);
    evt.preventDefault();
  }
}

// wait for visible key elements
function wfke(selector, callback) {
    var el = document.querySelector(selector);
    if (el) return callback(el);
    setTimeout(wfke, 100, selector, callback);
}

// constants
function init() {
  player = document.querySelector("video-js").player;
  player.on("keydown", handleKey);
  player.on("keyup", handleKeyUp);
  
  document.dispatchEvent(new CustomEvent("hold4speed:ready", { "detail": { player } }));
}
PluginApi.Event.addEventListener("stash:location", () => wfke("video-js", init))
