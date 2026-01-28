# HB72 Plugins Collection

A collection of user scripts and plugins for Stash app, designed to enhance functionality and improve user experience.

## Available Plugins

### 1. Custom Context Menu
- **File**: [`customContextMenu/customContextMenu.js`](customContextMenu/customContextMenu.js)
- **Description**: Adds a custom context menu to the video player with playback controls
- **Version**: 0.1.0
- **Dependencies**: None
- **Features**:
  - Right-click on video player to access custom menu
  - Playback speed controls (1x, 2x)
  - Toggle captions
  - Frame step forward/backward (when paused)
- **Usage**: Right-click on the video player to access the custom context menu

### 2. Hold4Speed
- **File**: [`hold4speed/hold4speed.js`](hold4speed/hold4speed.js)
- **Description**: Hold keys to change playback speed with multiple speed levels
- **Version**: 0.1.0
- **Dependencies**: None
- **Features**:
  - Hold 'b' for 4x playback speed
  - Hold 'c' for 8x playback speed
  - Hold 'v' for 16x playback speed
  - Automatically returns to normal speed when key is released
- **Usage**: Hold the specified keys while video is playing

### 3. Quick Tagger
- **File**: [`quickTagger/main.js`](quickTagger/main.js) (and related files)
- **Description**: Adds a quick tagger interface intended to be used with macros
- **Version**: 1.0
- **Dependencies**: 
  - CommunityScriptsUILibrary
- **Features**:
  - Quick tagging functionality
  - Integration with macros
  - Scene and marker element creation
- **Usage**: Most effective when used with macros

### 4. Rating Shortcut
- **File**: [`ratingShortcut/ratingShortcut.js`](ratingShortcut/ratingShortcut.js)
- **Description**: Adds keyboard shortcuts to quickly adjust scene ratings
- **Version**: 1.0.1
- **Dependencies**: 
  - React
  - Mousetrap
  - StashService utilities
- **Features**:
  - Shift + [ / ] : Adjust rating by ±5 points
  - Alt + [ / ] : Adjust rating by ±1 point
  - Ratings clamped between 0-100
  - Real-time scene updates
- **Usage**: 
  - `Shift + [` : Decrease rating by 5
  - `Shift + ]` : Increase rating by 5
  - `Alt + [` : Decrease rating by 1
  - `Alt + ]` : Increase rating by 1

## Installation

These plugins are designed to work with Stash app. Installation typically involves:

1. Copy the plugin folder to your Stash plugins directory
2. Enable the plugins in your Stash configuration
3. Restart Stash if required

## Dependencies

### Required Dependencies:
- **CommunityScriptsUILibrary** (for Quick Tagger)
- **React** (for Rating Shortcut)
- **Mousetrap** (for Rating Shortcut)
- **StashService utilities** (for Rating Shortcut)

### Optional Dependencies:
- None currently

## Compatibility

- **Stash App**: Compatible with modern Stash versions
- **Browser**: Modern browsers with JavaScript support
- **Platform**: Windows, macOS, Linux

## Development

Each plugin is self-contained in its own directory with:
- `.yml` configuration file
- `.js` implementation file(s)
- `README.md` (where applicable)

## License

These plugins are provided as-is for personal use. Please check individual plugin licenses for specific terms.

## Support

For issues or questions:
1. Check individual plugin README files
2. Review plugin source code for implementation details
3. Consult Stash documentation for plugin integration

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to improve any of the plugins in this collection.