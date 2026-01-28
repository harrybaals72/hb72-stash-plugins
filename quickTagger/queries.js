/**
 * Fetches the scene details including tags and file paths.
 * @param {string} id - The ID of the scene.
 * @returns {Promise<{tags: number[], paths: string[]}>} - The tags and paths of the scene.
 */
async function getScene(id) {
	var query = `
		query FindScene($id: ID) {
			findScene(id: $id) {
				tags {
					id
				}
				files {
					path
				}
			}
		}`;
	
	var variables = { id: id };
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);
	
	var result = await csLib.callGQL({ query, variables });
	console.log("findScene response: ", result);

	if (!result) {
		alert("No response from: " + query + " with variables: " + JSON.stringify(variables));
		return;
	} else if (!result.findScene) {
		alert("No scene found with ID: " + id);
		return;
	}

	var tags = result.findScene.tags.map(tag => parseInt(tag.id, 10));
	console.log("result.findScene.files: ", result.findScene.files);
	var paths = result.findScene.files.map(file => file.path);

	return { tags, paths };
}

/**
 * Fetches the tag ID based on the tag name.
 * @param {string} tagName - The name of the tag.
 * @param {boolean} createIfNotFound - Whether to create the tag if it is not found.
 * @returns {Promise<number>} - The ID of the tag.
 */
async function getTagIdFromName(tagName, createIfNotFound) {
	var query =
		"\
	query FindTags($tagFilter: TagFilterType) {\
		findTags(tag_filter: $tagFilter) {\
			tags {\
				id\
				name\
			}\
			count\
		}\
	}";

	var variables = { 
		tagFilter: { 
			name: {
				value: tagName.trim(),
				modifier: "EQUALS",
			} 
		} 
	};
	console.log(`getTagIdFromName GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);

	var result = await csLib.callGQL({ query, variables });
	console.log("findTag response: ", result);

	if (!result) {
		alert("No response from: " + query + " with variables: " + JSON.stringify(variables));
		return;
	}
		
	if (result.findTags.count == 0) {
		if (createIfNotFound) {
			console.log("Creating tag: " + tagName);
			result = await createTag(tagName);
			console.log("createTag response: ", result);
			if (!result) {
				alert("No response from createTag with tag name: " + tagName);
				return;
			}
			return getTagIdFromName(tagName, false);
		} else {
			alert("No tags found with name: " + tagName);
			return
		}
		
	}

	tagID = parseInt(result.findTags.tags[0].id, 10);
	console.log("Tag ID: ", tagID);
	return tagID;
}

async function getPerformerTags(id) {
	var query = `
		query GetPerformerTags($id: ID!) {
			findPerformer(id: $id) {
				tags {
					id
				}
			}
		}`;
	
	var variables = { id: id };
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);
	
	var result = await csLib.callGQL({ query, variables });
	console.log("findPerformer response: ", result);

	if (!result) {
		alert("No response from: " + query + " with variables: " + JSON.stringify(variables));
		return;
	} else if (!result.findPerformer) {
		alert("No performer found with ID: " + performerId);
		return;
	}

	var tags = result.findPerformer.tags.map(tag => parseInt(tag.id, 10));
	console.log("Performer tags: ", tags);
	return tags;
}

async function findScenesByPerformerId(id) {
	var query = `
		query FindScenes($filter: FindFilterType, $scene_filter: SceneFilterType) {
			findScenes(filter: $filter, scene_filter: $scene_filter) {
				scenes {
					id
					files {
						path
					}
				}
			}
		}`
	
	var variables = {
		filter: {
			per_page: -1
		},
		scene_filter: {
			performers: {
				value: id,
				modifier: "INCLUDES_ALL",
      	excludes: []
			}
		}
	}
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);
	
	var result = await csLib.callGQL({ query, variables });
	console.log("findScenes response: ", result);

	if (!result) {
		alert("No response from: " + query + " with variables: " + JSON.stringify(variables));
		return;
	} else if (!result.findScenes) {
		alert("No scenes found with performer ID: " + id);
		return;
	}

	var sceneIds = result.findScenes.scenes.map(scene => parseInt(scene.id, 10));
	// var paths = result.findScenes.scenes.map(scene => scene.files.map(file => file.path));
	var paths = result.findScenes.scenes.flatMap(scene => scene.files.map(file => file.path));

	console.log("Scene IDs: ", sceneIds);
	console.log("Scene paths: ", paths);
	return { sceneIds, paths };
}