import os
import csv


def should_include(row):
    # filter out recordings with human voice prefix
    if row["Recordist"] == "Wil Hershberger":
        return False

    # filter out recordings containing birdsong - giveaway
    # if row[""]

    return True


RAW_DIR = "raw_csv"
CLEAN_DIR = "filtered_csv"

# find csv files for each taxon in this directory
for file in os.listdir(RAW_DIR):
    if not os.path.splitext(file)[1] == ".csv":
        continue

    filtered_rows = []

    # read in file
    with open(os.path.join(RAW_DIR, file), encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        filtered_rows = [row for row in reader if should_include(row)]

    common_name = filtered_rows[0]["Common Name"]

    # write filtered version
    with open(f"{CLEAN_DIR}/{common_name}.csv", 'w', encoding='utf-8', newline='') as outfile:
        fieldnames = filtered_rows[0].keys() if filtered_rows else []
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(filtered_rows)
