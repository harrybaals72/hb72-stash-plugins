import sys
import json
import requests
import re
import os

def call_graphql(query, variables=None):
    url = os.environ.get("STASH_URL", "http://localhost:9999/graphql")
    api_key = os.environ.get("STASH_API_KEY")
    
    headers = {
        "Content-Type": "application/json",
    }
    if api_key:
        headers["ApiKey"] = api_key

    payload = {
        "query": query,
        "variables": variables
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        result = response.json()
        if "errors" in result:
            for error in result["errors"]:
                print(f"GraphQL error: {error['message']}", file=sys.stderr)
            return None
        return result.get("data")
    else:
        print(f"GraphQL query failed: {response.status_code} - {response.text}", file=sys.stderr)
        return None

def main():
    # Read input from stdin
    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("Error: Invalid JSON input", file=sys.stderr)
        return

    args = input_data.get("args", {})
    tag_id = args.get("tag_id")

    if not tag_id:
        print("Error: No tag_id provided", file=sys.stderr)
        return

    # 1. Get Tag details
    tag_query = """
    query FindTag($id: ID!) {
      findTag(id: $id) {
        id
        name
        aliases
      }
    }
    """
    tag_data = call_graphql(tag_query, {"id": tag_id})
    if not tag_data or not tag_data.get("findTag"):
        print(f"Error: Tag {tag_id} not found", file=sys.stderr)
        return

    tag = tag_data["findTag"]
    name = tag["name"]
    aliases = tag.get("aliases", [])
    
    search_terms = [name] + aliases
    # Escape terms for regex and join with OR
    regex_pattern = "(?i)\\b(" + "|".join([re.escape(term) for term in search_terms]) + ")\\b"

    print(f"Searching for scenes matching: {', '.join(search_terms)}")

    # 2. Search for scenes matching Title or Details
    # We use the SceneFilterType to find scenes where Title or Details matches the regex
    scene_query = """
    query FindScenes($scene_filter: SceneFilterType!) {
      findScenes(scene_filter: $scene_filter, filter: { per_page: -1 }) {
        scenes {
          id
          title
          tags {
            id
          }
        }
      }
    }
    """
    
    # We want (Title matches regex) OR (Details matches regex)
    # Since SceneFilterType doesn't support top-level OR easily in a single filter object without nesting,
    # we can use the nested OR structure if supported, or just run two queries/filters.
    # Actually, Stash supports nested OR in SceneFilterType.
    
    scene_filter = {
        "OR": {
            "title": {
                "value": regex_pattern,
                "modifier": "MATCHES_REGEX"
            },
            "OR": {
                "details": {
                    "value": regex_pattern,
                    "modifier": "MATCHES_REGEX"
                }
            }
        }
    }

    scenes_data = call_graphql(scene_query, {"scene_filter": scene_filter})
    if not scenes_data:
        print("Error: Failed to fetch scenes", file=sys.stderr)
        return

    scenes = scenes_data["findScenes"]["scenes"]
    print(f"Found {len(scenes)} potential scenes.")

    # 3. Update scenes to add the tag
    updated_count = 0
    for scene in scenes:
        # Check if tag is already present
        if any(t["id"] == tag_id for t in scene["tags"]):
            continue
        
        update_query = """
        mutation SceneUpdate($input: SceneUpdateInput!) {
          sceneUpdate(input: $input) {
            id
          }
        }
        """
        tag_ids = [t["id"] for t in scene["tags"]] + [tag_id]
        update_vars = {
            "input": {
                "id": scene["id"],
                "tag_ids": tag_ids
            }
        }
        
        if call_graphql(update_query, update_vars):
            updated_count += 1

    print(f"Successfully added tag to {updated_count} scenes.")

if __name__ == "__main__":
    main()
