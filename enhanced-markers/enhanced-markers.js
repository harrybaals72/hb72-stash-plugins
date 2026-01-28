(function() {
    const { PluginApi, React } = window;

    // Helper to get marker ID from marker object
    // The markers in the player are mapped from scene.scene_markers
    // We need to find the original marker ID.
    function findMarkerId(player, markerTime) {
        const scene = player.stashScene;
        if (!scene || !scene.scene_markers) return null;
        // Find marker with closest time (to account for float precision)
        const marker = scene.scene_markers.find(m => Math.abs(m.seconds - markerTime) < 0.01);
        return marker ? marker.id : null;
    }

    async function deleteMarker(player, marker) {
        const markerId = findMarkerId(player, marker.seconds);
        if (!markerId) {
            console.error("Could not find marker ID for time:", marker.seconds);
            return;
        }

        if (!confirm("Are you sure you want to delete this marker?")) return;

        try {
            await PluginApi.utils.StashService.getClient().mutate({
                mutation: PluginApi.GQL.SceneMarkerDestroyDocument,
                variables: { id: markerId }
            });
            
            // Remove from player UI
            player.markers().removeMarker(marker);
            
            // Also update the local scene object so findMarkerId works if we re-hover
            if (player.stashScene && player.stashScene.scene_markers) {
                player.stashScene.scene_markers = player.stashScene.scene_markers.filter(m => m.id !== markerId);
            }

            console.log("Marker deleted successfully");
        } catch (err) {
            console.error("Failed to delete marker:", err);
            alert("Failed to delete marker: " + err.message);
        }
    }

    // Patch ScenePlayer to intercept the player instance
    PluginApi.patch.after("ScenePlayer", function(props, result) {
        const player = PluginApi.utils.InteractiveUtils.getPlayer();
        if (!player || player.enhancedMarkersPatched) return result;

        player.enhancedMarkersPatched = true;
        // Store scene data on player for easy access
        player.stashScene = props.scene;

        const markersPlugin = player.markers();
        if (!markersPlugin) return result;

        // Patch showMarkerTooltip to add delete button
        const originalShowMarkerTooltip = markersPlugin.showMarkerTooltip;
        markersPlugin.showMarkerTooltip = function(title, layer) {
            originalShowMarkerTooltip.apply(this, arguments);
            
            const tooltip = this.markerTooltip;
            if (!tooltip) return;

            // Check if button already exists
            if (tooltip.querySelector(".vjs-marker-delete-btn")) return;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "vjs-marker-delete-btn";
            deleteBtn.innerText = "Delete";
            
            // We need to find which marker is currently being hovered
            // The markers plugin doesn't easily expose the "active" marker object to showMarkerTooltip
            // but we can find it by title and layer if needed, or better, intercept the mouseenter event
            
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (this.activeMarker) {
                    deleteMarker(player, this.activeMarker);
                }
            };

            tooltip.appendChild(deleteBtn);
        };

        // Intercept mouseenter on markers to track the "active" marker
        const originalAddDotMarker = markersPlugin.addDotMarker;
        markersPlugin.addDotMarker = function(marker) {
            originalAddDotMarker.apply(this, arguments);
            const markerDiv = this.markerDivs[this.markerDivs.length - 1].dot;
            if (markerDiv) {
                markerDiv.addEventListener("mouseenter", () => {
                    markersPlugin.activeMarker = marker;
                });
            }
        };

        const originalRenderRangeMarker = markersPlugin.renderRangeMarker;
        markersPlugin.renderRangeMarker = function(marker) {
            originalRenderRangeMarker.apply(this, arguments);
            const markerDiv = this.markerDivs[this.markerDivs.length - 1].range;
            if (markerDiv) {
                markerDiv.addEventListener("mouseenter", () => {
                    markersPlugin.activeMarker = marker;
                });
            }
        };

        return result;
    });

    // Register settings component
    const EnhancedMarkersSettings = () => {
        const [tagColors, setTagColors] = React.useState({});
        const [newTag, setNewTag] = React.useState("");
        const [newColor, setNewColor] = React.useState("#ff0000");

        React.useEffect(() => {
            const saved = localStorage.getItem("enhanced-markers-colors");
            if (saved) setTagColors(JSON.parse(saved));
        }, []);

        const saveColors = (colors) => {
            setTagColors(colors);
            localStorage.setItem("enhanced-markers-colors", JSON.stringify(colors));
        };

        const addTag = () => {
            if (!newTag) return;
            saveColors({ ...tagColors, [newTag]: newColor });
            setNewTag("");
        };

        const removeTag = (tag) => {
            const newColors = { ...tagColors };
            delete newColors[tag];
            saveColors(newColors);
        };

        const { Bootstrap } = PluginApi.libraries;

        return React.createElement(Bootstrap.Container, { className: "mt-3" },
            React.createElement("h4", null, "Enhanced Markers Settings"),
            React.createElement("p", null, "Configure custom colors for specific tags."),
            React.createElement(Bootstrap.Form, { className: "mb-3" },
                React.createElement(Bootstrap.Row, null,
                    React.createElement(Bootstrap.Col, null,
                        React.createElement(Bootstrap.Form.Control, {
                            placeholder: "Tag Name",
                            value: newTag,
                            onChange: (e) => setNewTag(e.target.value)
                        })
                    ),
                    React.createElement(Bootstrap.Col, { xs: "auto" },
                        React.createElement(Bootstrap.Form.Control, {
                            type: "color",
                            value: newColor,
                            onChange: (e) => setNewColor(e.target.value)
                        })
                    ),
                    React.createElement(Bootstrap.Col, { xs: "auto" },
                        React.createElement(Bootstrap.Button, { onClick: addTag }, "Add")
                    )
                )
            ),
            React.createElement(Bootstrap.ListGroup, null,
                Object.entries(tagColors).map(([tag, color]) =>
                    React.createElement(Bootstrap.ListGroup.Item, { key: tag, className: "d-flex justify-content-between align-items-center" },
                        React.createElement("div", null,
                            React.createElement("span", {
                                style: {
                                    display: "inline-block",
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: color,
                                    marginRight: "10px",
                                    verticalAlign: "middle",
                                    borderRadius: "3px"
                                }
                            }),
                            tag
                        ),
                        React.createElement(Bootstrap.Button, { variant: "danger", size: "sm", onClick: () => removeTag(tag) }, "Remove")
                    )
                )
            )
        );
    };

    // Patch PluginSettings to show our custom settings UI
    PluginApi.patch.after("PluginSettings", function(props, result) {
        if (props.pluginID !== "enhanced-markers") return result;

        return React.createElement(React.Fragment, null,
            result,
            React.createElement(EnhancedMarkersSettings, null)
        );
    });

    // Patch markers plugin to apply custom colors
    // We need to intercept findColors or addDotMarker/renderRangeMarker
    // Overriding tagColors in the plugin instance is easiest.
    
    function applyCustomColors(markersPlugin) {
        const saved = localStorage.getItem("enhanced-markers-colors");
        if (!saved) return;
        const customColors = JSON.parse(saved);
        
        // Merge custom colors into the plugin's tagColors
        Object.assign(markersPlugin.tagColors, customColors);
    }

    // We can hook into findColors to ensure our colors are applied after it runs
    const originalFindColors = videojs.getPlugin("markers").prototype.findColors;
    videojs.getPlugin("markers").prototype.findColors = function() {
        originalFindColors.apply(this, arguments);
        applyCustomColors(this);
    };

})();
