import argparse
import requests
from bs4 import BeautifulSoup
import os
import random
from pydub import AudioSegment
import concurrent.futures


def format_bird_name(bird_name):
    return bird_name.replace(" ", "_")


def fetch_audio_urls(bird_name):
    formatted_name = format_bird_name(bird_name)
    url = f"https://www.allaboutbirds.org/guide/{formatted_name}/sounds"
    response = requests.get(url)

    if response.status_code != 200:
        print("Failed to fetch the webpage. Please check the bird name and try again.")
        print("URL:", url)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    div_elements = soup.find_all("div", class_="player-audio")

    audio_urls = [div["name"] for div in div_elements if "name" in div.attrs]
    print("Extracted audio URLs:", audio_urls, "\n")

    return audio_urls


def download_audio(url, filename):
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        print(response)
        print(f"Failed to download {url} to {filename}")
        return None

    with open(filename, "wb") as f:
        for chunk in response.iter_content(1024):
            f.write(chunk)
    return filename


def download_all_audios(audio_urls):
    print("Downloading all audio")
    audio_files = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_url = {executor.submit(
            download_audio, url, f"audio_{idx}.mp3"): f"audio_{idx}.mp3" for idx, url in enumerate(audio_urls)}

        for future in concurrent.futures.as_completed(future_to_url):
            filename = future_to_url[future]
            try:
                if future.result():
                    audio_files.append(filename)
            except Exception as e:
                print(f"Error downloading {filename}: {e}")

    print(f"Successfully downloaded {len(audio_files)} audio files")
    return audio_files


def create_looped_audio(audio_files, output_filename, duration_minutes):
    target_duration = duration_minutes * 60 * \
        1000  # Convert minutes to milliseconds
    combined = AudioSegment.empty()
    recent_files = []
    max_retries = 10
    k = len(audio_files) // 4
    print(f"Will avoid repeating one of the previous {k} audio files")

    # load all audio once
    print("Loading audio")
    audio_data_dict = {}
    for file in audio_files:
        audio_data_dict[file] = AudioSegment.from_file(file)

    while len(combined) < target_duration:
        print("Appending audio files in a shuffled order")

        # find a random permutation that doesn't repeat the most recent files
        for _ in range(max_retries):
            shuffled_files = random.sample(audio_files, len(audio_files))
            repeated_too_soon = \
                recent_files and \
                shuffled_files[0] in recent_files[len(audio_files)-k:] or \
                shuffled_files[1] in recent_files[len(audio_files)-k:]
            if not repeated_too_soon:
                break

        for file in shuffled_files:
            if len(combined) >= target_duration:
                break
            # print(file)
            combined += audio_data_dict[file]
            recent_files.append(file)

    print(f"Saving final audio to {output_filename}")
    combined.export(output_filename, format="mp3")
    print(f"Done")


def process_bird(bird_name, duration_minutes):
    print(f"\nProcessing {bird_name} ------------------------------------")
    if os.path.exists(f"{bird_name}.mp3"):
        print("Combined audio exists already, skipping")
        return

    audio_urls = fetch_audio_urls(bird_name)
    if not audio_urls:
        return

    audio_files = download_all_audios(audio_urls)
    if len(audio_files) < len(audio_urls):
        print("FAILED AUDIO DOWNLOADS, ABORTING")
    elif audio_files:
        output_filename = f"{bird_name}.mp3"
        create_looped_audio(audio_files, output_filename, duration_minutes)

    # Cleanup downloaded files
    for file in audio_files:
        os.remove(file)


def main():
    parser = argparse.ArgumentParser(
        description="Generate an audio loop of multiple birds' sounds.")
    parser.add_argument("bird_names", type=str, nargs='+',
                        help="Names of the birds")
    parser.add_argument("-m", "--minutes", type=int, default=30,
                        help="Desired duration of the final audio in minutes")
    args = parser.parse_args()

    for bird_name in args.bird_names:
        process_bird(bird_name, args.minutes)


if __name__ == "__main__":
    main()
