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

            // Bind keys: Shift + [ and ] for 5 unit increments
            // Bind keys: Alt + [ and ] for 1 unit increments
            Mousetrap.bind("shift+[", () => adjustRating(-5));
            Mousetrap.bind("shift+]", () => adjustRating(5));
            Mousetrap.bind("alt+[", () => adjustRating(-1));
            Mousetrap.bind("alt+]", () => adjustRating(1));

            return () => {
                Mousetrap.unbind("shift+[");
                Mousetrap.unbind("shift+]");
                Mousetrap.unbind("alt+[");
                Mousetrap.unbind("alt+]");
            };
        }, [scene.id, scene.rating100, updateScene]);

        // Return the original props as a list of arguments for the component
        return [props];
    });
})();
