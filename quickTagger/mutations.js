async function metadataScanFromPaths(paths) {
	const query = `
		mutation MetadataScan($input: ScanMetadataInput!) {
			metadataScan(input: $input)
		}`;

	const variables = {
		input: {
			paths: paths,
			rescan: true
		}
	};
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);

	var result = await csLib.callGQL({ query, variables });
	console.log("metadataScan response: ", result);
	return;
}

async function metadataScanFromSceneId(sceneId) {
	var { paths: paths } = await getScene(sceneId);
	metadataScanFromPaths(paths);
}

async function updateSceneTags(sceneId, tags) {
	const query = `
    mutation setSceneTags($input: SceneUpdateInput!) {
      sceneUpdate(input: $input) {
        id
      }
    }`;

	const variables = { 
		input: {
			id: sceneId,
			tag_ids: tags
		} 
	};
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);

	var result =  await csLib.callGQL({ query, variables });
	console.log("updateScene response: ", result);

	if (!result) {
		alert("No response from: " + mutation + " with variables: " + JSON.stringify(variables));
		return;
	}

  return result;
}

async function updateSceneTagsBulk(ids, tag_ids) {
	const query = `
		mutation BulkSceneAddTags($input: BulkSceneUpdateInput!) {
			bulkSceneUpdate(input: $input) {
				id
			}
		}`;

	const variables = {
		input: {
			ids: ids,
			tag_ids: {
				ids: tag_ids,
				mode: "ADD"
			}
		}
	};
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);

	var result = await csLib.callGQL({ query, variables });
	console.log("updateScene response: ", result);

	if (!result) {
		alert("No response from: " + mutation + " with variables: " + JSON.stringify(variables));
		return;
	}

	return result;
}

async function updatePerformerTags(id, tag_ids) {
	const query = `
		mutation setPerformerTags($input: PerformerUpdateInput!) {
			performerUpdate(input: $input) {
				id
			}
		}`;
	
	const variables = {
		input: {
			id: id,
			tag_ids: tag_ids
		}
	};
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);

	var result = await csLib.callGQL({ query, variables });
	console.log("updatePerformer response: ", result);

	if (!result) {
		alert("No response from: " + mutation + " with variables: " + JSON.stringify(variables));
		return;
	}
	
	return result;
}

async function createMarker(scene_id, primary_tag_id, seconds, tag_ids, title) {
	const query = `
		mutation SceneMarkerCreate($input: SceneMarkerCreateInput!) {
			sceneMarkerCreate(input: $input) {
				id
			}
		}`;
	
	const variables = {
		input: {
			scene_id: scene_id,
			primary_tag_id: primary_tag_id,
			seconds: seconds,
			tag_ids: tag_ids,
			title: title
		}
	};
	console.log(`GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);

	var result = await csLib.callGQL({ query, variables });
	console.log("createMarker response: ", result);

	if (!result) {
		alert("No response from: " + mutation + " with variables: " + JSON.stringify(variables));
		return;
	}

	// metadataScanFromSceneId(scene_id);
}

async function createTag(name) {
	const query = `
		mutation tagCreate($input: TagCreateInput!) {
			tagCreate(input: $input) {
				name
			}
		}`;
	const variables = {
		input: {
			name: name,
		}
	};
	console.log(`createTag GraphQL Query: ${query} Variables: ${JSON.stringify(variables)}`);
	var result = await csLib.callGQL({ query, variables });
	console.log("createTag response: ", result);
	if (!result) {
		alert("No response from: " + query + " with variables: " + JSON.stringify(variables));
		return;
	}
	return result
}