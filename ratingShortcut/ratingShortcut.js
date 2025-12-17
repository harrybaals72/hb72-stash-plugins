(function() {
    const { React, patch, utils, libraries } = window.PluginApi;
    const { useSceneUpdate } = utils.StashService;
    const { useEffect } = React;
    const Mousetrap = libraries.Mousetrap;

    patch.before("ScenePage", (props) => {
        const [updateScene] = useSceneUpdate();
        const scene = props.scene;

        useEffect(() => {
            const adjustRating = (increment) => {
                const currentRating = scene.rating100 || 0;
                let newRating = currentRating + increment;
                
                // Clamp values between 0 and 100
                newRating = Math.max(0, Math.min(100, newRating));

                if (newRating !== currentRating) {
                    updateScene({
                        variables: {
                            input: {
                                id: scene.id,
                                rating100: newRating,
                            },
                        },
                    });
                }
            };

            // Bind keys: Shift + Up/Down for 0.5 increments (5 units)
            // Bind keys: Alt + Up/Down for 0.1 increments (1 unit)
            Mousetrap.bind("shift+up", () => adjustRating(5));
            Mousetrap.bind("shift+down", () => adjustRating(-5));
            Mousetrap.bind("alt+up", () => adjustRating(1));
            Mousetrap.bind("alt+down", () => adjustRating(-1));

            return () => {
                Mousetrap.unbind("shift+up");
                Mousetrap.unbind("shift+down");
                Mousetrap.unbind("alt+up");
                Mousetrap.unbind("alt+down");
            };
        }, [scene.id, scene.rating100, updateScene]);

        // Return the original props as a list of arguments for the component
        return [props];
    });
})();
