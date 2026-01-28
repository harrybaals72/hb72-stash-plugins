(function() {
    const { React, patch, utils, libraries } = window.PluginApi;
    const { useSceneUpdate, usePerformerUpdate } = utils.StashService;
    const { useEffect } = React;
    const Mousetrap = libraries.Mousetrap;

    // Shared rating adjustment logic
    const adjustRating = (currentRating, increment, updateFn, id) => {
        let newRating = currentRating + increment;
        
        // Clamp values between 0 and 100
        newRating = Math.max(0, Math.min(100, newRating));

        if (newRating !== currentRating) {
            updateFn({
                variables: {
                    input: {
                        id: id,
                        rating100: newRating,
                    },
                },
            });
        }
    };

    // ScenePage patch
    patch.before("ScenePage", (props) => {
        const [updateScene] = useSceneUpdate();
        const scene = props.scene;

        useEffect(() => {
            Mousetrap.bind("shift+[", () => adjustRating(scene.rating100 || 0, -5, updateScene, scene.id));
            Mousetrap.bind("shift+]", () => adjustRating(scene.rating100 || 0, 5, updateScene, scene.id));
            Mousetrap.bind("alt+[", () => adjustRating(scene.rating100 || 0, -1, updateScene, scene.id));
            Mousetrap.bind("alt+]", () => adjustRating(scene.rating100 || 0, 1, updateScene, scene.id));

            return () => {
                Mousetrap.unbind("shift+[");
                Mousetrap.unbind("shift+]");
                Mousetrap.unbind("alt+[");
                Mousetrap.unbind("alt+]");
            };
        }, [scene.id, scene.rating100, updateScene]);

        return [props];
    });

    // PerformerPage patch
    patch.before("PerformerPage", (props) => {
        const [updatePerformer] = usePerformerUpdate();
        const performer = props.performer;

        useEffect(() => {
            Mousetrap.bind("shift+[", () => adjustRating(performer.rating100 || 0, -5, updatePerformer, performer.id));
            Mousetrap.bind("shift+]", () => adjustRating(performer.rating100 || 0, 5, updatePerformer, performer.id));
            Mousetrap.bind("alt+[", () => adjustRating(performer.rating100 || 0, -1, updatePerformer, performer.id));
            Mousetrap.bind("alt+]", () => adjustRating(performer.rating100 || 0, 1, updatePerformer, performer.id));

            return () => {
                Mousetrap.unbind("shift+[");
                Mousetrap.unbind("shift+]");
                Mousetrap.unbind("alt+[");
                Mousetrap.unbind("alt+]");
            };
        }, [performer.id, performer.rating100, updatePerformer]);

        return [props];
    });
})();
