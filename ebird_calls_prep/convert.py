import os
import csv
import json

iNaturalist_ids = {"Cardinalis cardinalis": 9083, "Poecile carolinensis": 144814, "Thryothorus ludovicianus": 7513, "Baeolophus bicolor": 13632, "Corvus brachyrhynchos": 8021, "Melanerpes carolinus": 18205, "Pipilo erythrophthalmus": 9424, "Turdus migratorius": 12727, "Mimus polyglottos": 14886, "Cyanocitta cristata": 8229, "Dryobates pubescens": 792988, "Zenaida macroura": 3454, "Sialia sialis": 12942, "Spinus tristis": 145310, "Haemorhous mexicanus": 199840, "Spizella passerina": 9135, "Sitta carolinensis": 14801, "Sayornis phoebe": 17008, "Sturnus vulgaris": 14850, "Colaptes auratus": 18236, "Agelaius phoeniceus": 9744, "Passerina cyanea": 10227, "Quiscalus quiscula": 9602, "Dumetella carolinensis": 14995, "Zonotrichia albicollis": 9184, "Junco hyemalis": 10094, "Setophaga coronata": 145245, "Corthylio calendula": 1289388, "Melospiza melodia": 9100, "Setophaga pinus": 145244, "Sitta pusilla": 14825, "Passer domesticus": 13858, "Toxostoma rufum": 14898, "Strix varia": 19893, "Setophaga cerulea": 145232,
                   "Limnothlypis swainsonii": 10442, "Parkesia motacilla": 73148, "Parkesia noveboracensis": 73149, "Setophaga fusca": 145237, "Cardellina canadensis": 145275, "Setophaga striata": 145240, "Setophaga ruticilla": 10247, "Setophaga petechia": 145238, "Protonotaria citrea": 10729, "Setophaga dominica": 145246, "Helmitheros vermivorum": 72912, "Geothlypis formosa": 145225, "Setophaga discolor": 145249, "Setophaga citrina": 145229, "Seiurus aurocapilla": 62550, "Setophaga tigrina": 145231, "Setophaga pensylvanica": 145239, "Oporornis agilis": 10431, "Vermivora cyanoptera": 73553, "Geothlypis philadelphia": 145224, "Leiothlypis ruficapilla": 979753, "Cardellina pusilla": 145276, "Setophaga castanea": 145236, "Leiothlypis celata": 979757, "Leiothlypis peregrina": 979756, "Vermivora chrysoptera": 9807, "Geothlypis trichas": 9721, "Setophaga americana": 145233, "Setophaga caerulescens": 199916, "Setophaga palmarum": 145242, "Setophaga virens": 145258, "Mniotilta varia": 10286, "Setophaga magnolia": 145235}

CLEAN_DIR = "csv_filtered"
json_data = {}

# find csv files for each taxon in this directory
for file in os.listdir(CLEAN_DIR):
    if not os.path.splitext(file)[1] == ".csv":
        continue

    # read in file
    with open(os.path.join(CLEAN_DIR, file), encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        observations = []
        for r in reader:
            obs_id = r["ML Catalog Number"]
            cdn_prefix = "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/"
            # chop off subspecies from scientific name
            sci_name = r["Scientific Name"].split()[:2]
            sci_name = " ".join(sci_name)

            obs = {
                # taxon_id will be used by javascript to fill in the taxon object
                "taxon_id": iNaturalist_ids[sci_name],
                "common_name": r["Common Name"],  # for convenience only
                "id": "ML" + obs_id,
                "uri": f"https://macaulaylibrary.org/asset/{obs_id}",
                "sounds": [{
                    "file_url": cdn_prefix + obs_id + "/mp3",
                    "attribution": f"(c) {r['Recordist']}"
                }],
                "description": r['Media notes'],
            }
            observations.append(obs)

        # add to JSON data
        json_data[observations[0]["taxon_id"]] = observations


# write to output javascript file
json_string = json.dumps(json_data, indent=2)
js_content = "const eBirdCalls = " + json_string
with open("ebird_calls.js", "w", encoding="utf-8") as js_file:
    js_file.write(js_content)
