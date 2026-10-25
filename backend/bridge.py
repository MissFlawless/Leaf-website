"""Runs one local API request for the Vite development server.

The embedded browser cannot always open a second localhost port.  This bridge
keeps development on one origin while still dispatching every request through
the real Flask app, database, authentication, and upload routes.
"""

import base64
import json
import sys

from run import app


def main():
    if len(sys.argv) != 4:
        raise SystemExit("Expected request method, URL, and headers.")

    method, url, serialized_headers = sys.argv[1:]
    headers = json.loads(serialized_headers)
    body = sys.stdin.buffer.read()

    with app.test_client() as client:
        response = client.open(url, method=method, headers=headers, data=body)

    forwarded_headers = {}
    for name in ("Content-Type", "Content-Disposition", "Cache-Control"):
        value = response.headers.get(name)
        if value:
            forwarded_headers[name] = value

    print(json.dumps({
        "status": response.status_code,
        "headers": forwarded_headers,
        "body": base64.b64encode(response.get_data()).decode("ascii"),
    }))


if __name__ == "__main__":
    main()
