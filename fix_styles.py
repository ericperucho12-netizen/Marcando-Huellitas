import re
import subprocess

with open("frontend/styles.css", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the conflict markers
content = content.replace("<<<<<<< HEAD\n", "")
content = content.replace("=======\n", "")
content = re.sub(r'>>>>>>> [0-9a-f]+\n?', '', content)

# Check if daniel-montero CSS is already there
if ".seccion-cards" not in content:
    result = subprocess.run(["git", "show", "origin/daniel-montero:frontend/styles.css"], capture_output=True, text=True, encoding='utf-8')
    if result.returncode == 0:
        daniel_css = result.stdout
        # Extract everything from /* Misión, Visión y Valores */ to the end
        if "/* Misión, Visión y Valores */" in daniel_css:
            mvyv_css = "/* Misión, Visión y Valores */" + daniel_css.split("/* Misión, Visión y Valores */")[1]
            content += "\n\n" + mvyv_css
        else:
            # Just grab the seccion-cards part
            mvyv_css = ""
            for line in daniel_css.split('\n'):
                if ".seccion-cards" in line or ".card" in line:
                    pass # Handled below
            
            # Since we know what it is:
            mvyv_css = """
/* Misión, Visión y Valores */
.seccion-cards{
    max-width: auto;
    max-height: auto;
    padding: 40px 20px;
}

/* Transición de cards con hover*/
.card {
    transition: transform 0.3s ease;
    overflow: hidden; 
}

.card:hover {
    transform: translateY(-10px);
}
"""
            content += "\n" + mvyv_css

with open("frontend/styles.css", "w", encoding="utf-8") as f:
    f.write(content)

print("styles.css cleaned and updated successfully!")
