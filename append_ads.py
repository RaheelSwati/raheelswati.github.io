import sys

# Replace Mintegral Publisher ID and clean up text
lines = sys.stdin.read().splitlines()

formatted_lines = []
for line in lines:
    if "mintigral mintegral.com" in line:
        line = line.replace("or mintigral mintegral.com", "mintegral.com")
        line = line.replace("your PublisherID", "56527")
    if "replace my publisher id" in line:
        continue
    if line.strip():
        formatted_lines.append(line.strip())

with open("app-ads.txt", "a") as f:
    f.write("\n" + "\n".join(formatted_lines) + "\n")
  
