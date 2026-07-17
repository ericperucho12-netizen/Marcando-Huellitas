import re
import os
import shutil

# 1. Merge styles-footer.css into styles.css
if os.path.exists("frontend/styles-footer.css"):
    with open("frontend/styles-footer.css", "r", encoding="utf-8") as f:
        footer_css = f.read()
    
    # Remove the :root block
    footer_css_clean = re.sub(r':root\s*\{[^}]+\}', '', footer_css, flags=re.DOTALL).strip()
    
    with open("frontend/styles.css", "a", encoding="utf-8") as f:
        f.write("\n\n/* --- FOOTER STYLES --- */\n")
        f.write(footer_css_clean)
        
    os.remove("frontend/styles-footer.css")

# 2. Move images from CorporativoPeludos to assets
if os.path.exists("CorporativoPeludos"):
    for file in os.listdir("CorporativoPeludos"):
        src = os.path.join("CorporativoPeludos", file)
        dst = os.path.join("assets", file)
        if os.path.isfile(src):
            shutil.move(src, dst)
    # Try to remove dir if empty
    try:
        os.rmdir("CorporativoPeludos")
    except:
        pass

# 3. Read footer.html and extract footer block
new_footer_html = ""
if os.path.exists("frontend/footer.html"):
    with open("frontend/footer.html", "r", encoding="utf-8") as f:
        footer_page = f.read()
        
    match = re.search(r'<footer[^>]*>.*?</footer>', footer_page, flags=re.IGNORECASE | re.DOTALL)
    if match:
        new_footer_html = match.group(0)
        # Fix absolute paths to relative
        # e.g., C:\Users\Amdrea\Desktop\CH 69\Proyecto Integrador\M-Huellitas\Marcando-Huellitas\assets\perrito1.png
        # We can just replace everything before \assets\ with ../
        new_footer_html = re.sub(r'C:[\\/][^"]+[\\/]assets[\\/]', '../assets/', new_footer_html, flags=re.IGNORECASE)
    
    os.remove("frontend/footer.html")

# 4. Update index.html
with open("frontend/index.html", "r", encoding="utf-8") as f:
    index_html = f.read()

# Replace CorporativoPeludos references
index_html = index_html.replace("../CorporativoPeludos/", "../assets/")

# Replace old footer with new footer
if new_footer_html:
    index_html = re.sub(r'<footer[^>]*>.*?</footer>', new_footer_html, index_html, flags=re.IGNORECASE | re.DOTALL)

with open("frontend/index.html", "w", encoding="utf-8") as f:
    f.write(index_html)

print("All tasks completed successfully!")
