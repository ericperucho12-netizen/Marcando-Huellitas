import re

with open("frontend/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace conflicts, keeping the incoming branch changes (which have the fixed https URLs)
new_content = re.sub(r'<<<<<<< HEAD\n.*?\n=======\n(.*?)\n>>>>>>> [a-f0-9]+\n?', r'\1\n', content, flags=re.DOTALL)

with open("frontend/index.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Conflicts resolved in index.html")
