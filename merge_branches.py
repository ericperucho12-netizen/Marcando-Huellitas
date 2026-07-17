import subprocess
import os

def git_show(branch, filepath):
    result = subprocess.run(["git", "show", f"{branch}:{filepath}"], capture_output=True, text=True, encoding='utf-8')
    if result.returncode != 0:
        return ""
    return result.stdout

navbar_full = git_show("origin/Rama_Elios", "docs/navbar.html")
mvyv_full = git_show("origin/daniel-montero", "frontend/MVyV.html")
corp_full = git_show("origin/Alma-Rama", "CorporativoPeludos.html")
footer_full = git_show("origin/Andrea-PC", "frontend/footer.html")

print(f"Loaded lengths - Navbar: {len(navbar_full)}, MVyV: {len(mvyv_full)}, Corp: {len(corp_full)}, Footer: {len(footer_full)}")

# Extract navbar: everything before <style> is HTML, the rest is style
nav_html = navbar_full.split('<style>')[0].strip()
nav_style = '<style>' + navbar_full.split('<style>')[1] if '<style>' in navbar_full else ""
if nav_style:
    nav_style = nav_style.replace('<style>', '').replace('</style>', '').strip()

# Extract MVyV: <section class="seccion-cards py-5">
if '<section class="seccion-cards' in mvyv_full:
    mvyv_html = '<section class="seccion-cards' + mvyv_full.split('<section class="seccion-cards')[1].split('</section>')[0] + '</section>'
    mvyv_html = mvyv_html.replace('src="/assets/', 'src="../assets/')
else:
    mvyv_html = ""

# Extract Corp: <section class="py-5" style="background-color: #fbf8cc; ...
if 'CORPORATIVO PELUDITOS' in corp_full:
    corp_html = '<section ' + corp_full.split('<section ')[1].split('</section>')[0] + '</section>'
    corp_html = corp_html.replace('src="CorporativoPeludos/', 'src="../CorporativoPeludos/')
else:
    corp_html = ""

# Extract footer: <footer>
if '<footer>' in footer_full:
    footer_html = '<footer>' + footer_full.split('<footer>')[1].split('</footer>')[0] + '</footer>'
else:
    footer_html = ""

print(f"Extracted lengths - Navbar HTML: {len(nav_html)}, MVyV: {len(mvyv_html)}, Corp: {len(corp_html)}, Footer: {len(footer_html)}")

index_path = "c:/Users/EricPS/Desktop/Marcando_Huellitas/frontend/index.html"
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

if "<body>" in index_content and nav_html:
    index_content = index_content.replace('<body>', f'<body>\n\n{nav_html}\n')
else:
    print("Failed to insert navbar.")

historia_end = '</section>\n    \n    <section class="team-section py-5">'
if historia_end in index_content and mvyv_html:
    index_content = index_content.replace(historia_end, f'</section>\n\n    {mvyv_html}\n    \n    <section class="team-section py-5">')
else:
    print("Failed to insert MVyV.")

# Insert Corp and Footer before the Bootstrap JS script tag
bootstrap_js_marker = '<!-- Bootstrap JS -->'
if bootstrap_js_marker in index_content:
    injection = f'{corp_html}\n\n    {footer_html}\n\n    {bootstrap_js_marker}'
    index_content = index_content.replace(bootstrap_js_marker, injection)
else:
    print("Failed to insert Corp and Footer.")

with open(index_path, "w", encoding="utf-8") as f:
    f.write(index_content)

styles_path = "c:/Users/EricPS/Desktop/Marcando_Huellitas/frontend/styles.css"
if os.path.exists(styles_path) and nav_style:
    with open(styles_path, "a", encoding="utf-8") as f:
        f.write('\n\n/* --- NAVBAR STYLES --- */\n')
        f.write(nav_style)
        
    print("Updated styles.css.")

print("Done merging!")
