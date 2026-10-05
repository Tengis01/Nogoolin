"""UE-5 Corg.ly exercise: subscribe to pet events. Contract is unverified."""

import argparse
import os
from urllib.parse import urlparse

import requests


def main() -> None:
    parser = argparse.ArgumentParser(description="Register an HTTPS webhook with a lab server")
    parser.add_argument("webhook_url", help="HTTPS callback owned by the caller")
    parser.add_argument("--pet-id", required=True, help="Registered pet ID")
    args = parser.parse_args()
    if urlparse(args.webhook_url).scheme != "https":
        parser.error("webhook_url must use HTTPS")
    base_url = os.environ["CORGLY_BASE_URL"].rstrip("/")
    token = os.environ["CORGLY_TOKEN"]
    response = requests.post(
        f"{base_url}/v1/webhooks/subscribe",
        headers={"Authorization": f"Bearer {token}"},
        json={"pet_id": args.pet_id, "url": args.webhook_url},
        timeout=20,
    )
    print(response.status_code, response.text)
    response.raise_for_status()


if __name__ == "__main__":
    main()
