import os
import csv

diff_species = [323504401, 147240231]
bird_starts_late = [539845]
bad_ids = diff_species + bird_starts_late


def should_include(row):
    if int(row["ML Catalog Number"]) in bad_ids:
        return False

    # filter out old recordings which tend to have human voice prefix
    if int(row["Year"]) < 2014:
        return False

    # filter out recordings containing birdsong - giveaway
    if "Song" in row["Behaviors"]:
        return False

    # filter out subspecies that aren't the main one
    taxa = row["Scientific Name"].split()
    species = taxa[1]
    subspecies = " ".join(taxa[2:])
    if subspecies and species not in subspecies:
        print("Ignoring subspecies", row["Scientific Name"])
        return False

    return True


RAW_DIR = "csv_raw"
CLEAN_DIR = "csv_filtered"
DESIRED_N_OBS = 15

not_enough_obs = []

# find csv files for each taxon in this directory
for file in os.listdir(RAW_DIR):
    if not os.path.splitext(file)[1] == ".csv":
        continue

    filtered_rows = []

    # read in file
    with open(os.path.join(RAW_DIR, file), encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if should_include(row):
                filtered_rows.append(row)
            if len(filtered_rows) >= DESIRED_N_OBS:
                break

    common_name = filtered_rows[0]["Common Name"]
    sci_name = filtered_rows[0]["Scientific Name"]

    # write filtered version
    with open(f"{CLEAN_DIR}/{common_name}.csv", 'w', encoding='utf-8', newline='') as outfile:
        fieldnames = filtered_rows[0].keys() if filtered_rows else []
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(filtered_rows)

    if len(filtered_rows) < DESIRED_N_OBS:
        not_enough_obs.append((common_name, sci_name))

print("\nNot enough observations:")
for taxon in not_enough_obs:
    print(taxon[0], "-", taxon[1])
