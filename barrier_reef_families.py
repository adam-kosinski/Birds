import requests
import time
import json

# great barrier reef
place_id = 131021

# ray finned fishes
parent_taxon_id = 47178

# get all families
families = {} # taxon_id: {name: "", count: 0, n_obs: 0}    - n_obs is the total # observations, count is what we observe from sampling observations

print("getting families")
for i in [1,2,3]:
    results = requests.get(f"https://api.inaturalist.org/v1/taxa?taxon_id={parent_taxon_id}&rank=family&per_page=200&page={i}").json()['results']
    for obj in results:
        families[obj['id']] = {
            'name': obj['preferred_common_name'] if 'preferred_common_name' in obj else "",
            'count': 0,
            'n_obs': 0
        }
print("got families\n")




# get observations in a place, increment family counts
for i in range(20):
    print(f"{i}) fetching")

    response = requests.get(f"https://api.inaturalist.org/v1/observations?photos=true&place_id={place_id}&iconic_taxa=Actinopterygii&quality_grade=research&per_page=200&page={i+1}")
    results = response.json()['results']
    for obj in results:
        ancestor_ids = obj['taxon']['ancestor_ids']
        for id in reversed(ancestor_ids):
            if id in families:
                if families[id]['count'] == 0:
                    print(f"new family: {families[id]['name']}")
                families[id]['count'] += 1
                break    

    print("sleeping\n")
    time.sleep(1)



# now that we have a sense, fetch observation counts for the families that showed up in observations
for item in families.items():
    if item[1]['count'] == 0:
        continue

    response = requests.get(f"https://api.inaturalist.org/v1/observations?photos=true&place_id={place_id}&quality_grade=research&taxon_id={item[0]}&only_id=true")
    n_obs = response.json()['total_results']
    families[item[0]]['n_obs'] = n_obs
    print(item[1]['name'], n_obs)

    time.sleep(1)


# filter sorted families for at least a certain number of observations
# output those families


n_obs_threshold = 30
filtered_families = sorted(families.items(), reverse=True, key=lambda a: a[1]['n_obs'])


with open("family_results.txt", "w") as result_file:
    for item in filtered_families:
        if item[1]['n_obs'] >= n_obs_threshold:
            result_file.write(f"{item[0]},    //{item[1]['name']}    n_obs: {item[1]['n_obs']}\n")
            