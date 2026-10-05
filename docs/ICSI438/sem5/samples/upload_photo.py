"""UE-5 Corg.ly exercise: upload one pet image. Contract is unverified."""

import argparse
import os
from pathlib import Path

import requests


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload a pet photo to a configured lab server")
    parser.add_argument("photo", type=Path, help="Existing pet image path")
    parser.add_argument("--pet-id", required=True, help="Registered pet ID")
    args = parser.parse_args()
    base_url = os.environ["CORGLY_BASE_URL"].rstrip("/")
    token = os.environ["CORGLY_TOKEN"]
    with args.photo.open("rb") as image:
        response = requests.post(
            f"{base_url}/v1/pets/upload-photo",
            headers={"Authorization": f"Bearer {token}"},
            data={"pet_id": args.pet_id},
            files={"photo": (args.photo.name, image, "image/jpeg")},
            timeout=20,
        )
    print(response.status_code, response.text)
    response.raise_for_status()


if __name__ == "__main__":
    main()
