"""UE-5 Corg.ly exercise: request bark translation. Contract is unverified."""

import argparse
import os
from pathlib import Path

import requests


def main() -> None:
    parser = argparse.ArgumentParser(description="Send a bark recording to a configured lab server")
    parser.add_argument("audio", type=Path, help="Existing WAV recording path")
    parser.add_argument("--pet-id", required=True, help="Registered pet ID")
    args = parser.parse_args()
    base_url = os.environ["CORGLY_BASE_URL"].rstrip("/")
    token = os.environ["CORGLY_TOKEN"]
    with args.audio.open("rb") as recording:
        response = requests.post(
            f"{base_url}/v1/audio/translate-bark",
            headers={"Authorization": f"Bearer {token}"},
            data={"pet_id": args.pet_id},
            files={"audio": (args.audio.name, recording, "audio/wav")},
            timeout=30,
        )
    print(response.status_code, response.text)
    response.raise_for_status()


if __name__ == "__main__":
    main()
