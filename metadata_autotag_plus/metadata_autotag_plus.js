(function() {
    const {
        React,
        PluginApi,
    } = window;

    const { Button } = PluginApi.libraries.Bootstrap;

    PluginApi.patch.after("TagPage", (props, result) => {
        const tag = props.tag;
        if (!tag || !tag.id) return result;

        // Find the DetailsEditNavbar in the result tree
        // The result is a React element tree.
        // In Tag.tsx, it's inside a div with className "tag-head col"
        
        const findAndPatchNavbar = (node) => {
            if (!node || !node.props) return;

            // Check if it's the DetailsEditNavbar by looking at its props
            if (node.type && (node.type.name === "DetailsEditNavbar" || (node.props.onAutoTag && node.props.onToggleEdit))) {
                const originalCustomButtons = node.props.customButtons;
                
                const autoTagMetadataButton = React.createElement(Button, {
                    variant: "secondary",
                    className: "ml-2",
                    onClick: async () => {
                        try {
                            await PluginApi.utils.StashService.mutateRunPluginTask(
                                "metadata_autotag_plus",
                                "autoTagMetadata",
                                { tag_id: tag.id }
                            );
                            alert("Started metadata auto-tagging task.");
                        } catch (e) {
                            console.error(e);
                            alert("Failed to start task: " + e.message);
                        }
                    }
                }, "Auto Tag (Metadata)");

                node.props.customButtons = React.createElement(React.Fragment, {}, 
                    originalCustomButtons,
                    autoTagMetadataButton
                );
                return true;
            }

            if (node.props.children) {
                if (Array.isArray(node.props.children)) {
                    for (const child of node.props.children) {
                        if (findAndPatchNavbar(child)) return true;
                    }
                } else {
                    return findAndPatchNavbar(node.props.children);
                }
            }
            return false;
        };

        findAndPatchNavbar(result);

        return result;
    });
})();
