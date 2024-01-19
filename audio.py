import requests
import os
import re
import json
from pydub import AudioSegment # pydub relies on ffmpeg, which can be installed with: sudo apt install ffmpeg
# import pyloudnorm   # https://github.com/csteinmetz1/pyloudnorm
# import soundfile as sf  # https://pypi.org/project/soundfile/



def get_duration_and_loudness(audio_url):

    response = requests.get(audio_url)

    # write to a temp file
    ext = re.search(r'.\w+', os.path.splitext(audio_url)[1]).group()   # use regex to remove url params
    download_filename = "AUDIO_DOWNLOAD_TEMP" + ext
    with open(download_filename, mode="wb") as file:
        file.write(response.content)

    # read with pydub
    audio = AudioSegment.from_file(download_filename)

    # remove temp file and return
    os.remove(download_filename)
    return audio.duration_seconds, audio.dBFS


'''
JavaScript for getting sound url JSON

let sound_urls = {};
for(let taxon_id in taxon_obs) {
    sound_urls[taxon_id] = taxon_obs[taxon_id].map(function(obj){
        return {
            "id": obj.id,
            "sound_url": obj.sounds[0].file_url?.split("?")[0]
        }
    });
}
console.log(JSON.stringify(sound_urls, null, 4));
'''

json_input_file = "audio_urls.json"
json_output_file = "audio_data.json"


print("loading json")

# input
with open(json_input_file, mode="r") as file:
    url_data = json.load(file)
n_taxa = len(url_data)

# output
try:
    with open(json_output_file, mode="r") as file:
        output_json = json.load(file)
except:
    # probably previous output doesn't exist, create new output
    output_json = {}


for i, taxon_id in enumerate(url_data):

    print(f"{i+1}/{n_taxa}: taxon_id {taxon_id}")
    if taxon_id not in output_json:
        output_json[taxon_id] = []

    for k, observation in enumerate(url_data[taxon_id]):
        if 'sound_url' not in observation:
            continue
        if taxon_id in output_json:
            id_matches = map(lambda prev_output_obj: prev_output_obj['id'] == observation['id'], output_json[taxon_id])
            if any(id_matches):
                continue

        duration, loudness = get_duration_and_loudness(observation['sound_url'])
        print(f"    {k+1}/{len(url_data[taxon_id])} - duration: {duration}, loudness: {loudness}")
        output_json[taxon_id].append({
            'id': observation['id'],
            'duration': duration,
            'loudness': loudness
        })

        # write json after each 10 observations as a backup
        if (k+1) % 10 == 0:
            with open(json_output_file, mode="w") as file:
                json.dump(output_json, file, indent=4)

    # write json after each taxa as a backup
    with open(json_output_file, mode="w") as file:
        json.dump(output_json, file, indent=4)
