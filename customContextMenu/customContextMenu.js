// see README for shortcuts

/*
// ,. will override stash commands when focused on video
. - when paused, step forward one frame
, - when paused, step back one frame
> - speed up playback rate
< - slow down playback rate
c - activate/ deactivate captions
*/

(function() {
    // declarations
    let player, framestep;
    let markers = [];

function wfke(selector, callback) {
    var el = document.querySelector(selector);
    if (el) return callback(el);
    setTimeout(wfke, 100, selector, callback);
}

function init() {
  player = document.querySelector("video-js");
  // player.on("keydown", handleKey);
  // player.on("keyup", handleKeyUp);
  
  player.el().addEventListener('contextmenu', (e) => {
    console.log('Context menu event triggered on video-js player');
    e.preventDefault();
    showCustomMenu(e.clientX, e.clientY);
  });
  
  document.dispatchEvent(new CustomEvent("customContextMenu:ready", { "detail": { player } }));
}



// function handleKeyUp(evt) {
//   const key = evt.key;
//   if (key == "b" || key == "c" || key == "v") {
//     player.playbackRate(1);
//     evt.preventDefault();
//   }
// }

// function handleKey(evt) {
//   const key = evt.key;
  
//   // speed up playback rate (hold 'b' for 2x)
//   if (key == "b") {
//     player.playbackRate(4);
//     evt.preventDefault();
//   }
//   // c - speed up playback rate (hold 'c' for 8x)
//   else if (key == "c") {
//     player.playbackRate(8);
//     evt.preventDefault();
//   }
//   // v - speed up playback rate (hold 'v' for 16x)
//   else if (key == "v") {
//     player.playbackRate(16);
//     evt.preventDefault();
//   }
// }

// wait for visible key elements


// constants


function showCustomMenu(x, y) {
  // Remove existing menu if any
  const existingMenu = document.querySelector('.custom-context-menu');
  if (existingMenu) {
    console.log('Removing existing custom menu');
    existingMenu.remove();
  }

  const menu = document.createElement('div');
  menu.className = 'custom-context-menu';
  menu.style.position = 'fixed';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.backgroundColor = '#2d2d2d';
  menu.style.border = '1px solid #444';
  menu.style.borderRadius = '4px';
  menu.style.padding = '4px 0';
  menu.style.zIndex = '9999';

  const menuItems = [
    { label: 'Playback Speed 1x', action: () => player.playbackRate(1) },
    { label: 'Playback Speed 2x', action: () => player.playbackRate(2) },
    { label: 'Toggle Captions', action: () => {
      const track = player.textTracks().tracks[0];
      track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
    }},
    { label: 'Frame Step Forward', action: () => {
      if (player.paused()) player.currentTime(player.currentTime() + (1/player.playbackRate()));
    }},
    { label: 'Frame Step Back', action: () => {
      if (player.paused()) player.currentTime(player.currentTime() - (1/player.playbackRate()));
    }}
  ];

  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.textContent = item.label;
    menuItem.style.padding = '6px 12px';
    menuItem.style.cursor = 'pointer';
    menuItem.style.color = '#fff';
    menuItem.addEventListener('mouseenter', () => {
      menuItem.style.backgroundColor = '#3d3d3d';
    });
    menuItem.addEventListener('mouseleave', () => {
      menuItem.style.backgroundColor = 'transparent';
    });
    menuItem.addEventListener('click', () => {
      console.log(`Menu item clicked: ${item.label}`);
      try {
        item.action();
      } catch (e) {
        console.error(`Error executing menu action: ${e.message}`);
      }
      menu.remove();
    });
    menu.appendChild(menuItem);
  });

  document.body.appendChild(menu);

  // Close menu when clicking elsewhere
  document.addEventListener('click', function closeMenu() {
    console.log('Closing menu due to outside click');
    menu.remove();
    document.removeEventListener('click', closeMenu);
  }, { once: true });
}

wfke("video-js", init);
PluginApi.Event.addEventListener("stash:location", () => wfke("video-js", init));
})();
