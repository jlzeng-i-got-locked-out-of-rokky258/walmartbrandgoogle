import requests

def valid(content):
    invalidstrings = [
        "403",
        "buy this domain",
        "parked domain",
        "domain name parking",
        "an error occurred",
        "domain owner",
        "webmaster",
        "file not found",
        "expired domain",
        "park your domains",
        "served automatically",
        "may be for sale",
        "account suspended"
    ]

    if len(content) < 50:
        return False

    content = content.lower()
    for s in invalidstrings:
        if s in content:
            return False

    return True


if __name__ == "__main__":
    
    f = open("1hosts.txt", "r")

    out = open("out.txt", "w")
    out.close()

    for line in f.readlines():
        try:
            out = open("out.txt", "a")
            response = requests.get("http://" + line[:-1], timeout=1)
            if valid(response.text):
                out.write(line)
                print("Valid: ", line[:-1])
            else:
                print("Invalid: ", line[:-1])
            out.close()
        except Exception as err:
            pass
