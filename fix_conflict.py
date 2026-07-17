import re

with open("frontend/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Extract the colored team row
match = re.search(r'=======\n\s*(<div class="row g-4">.*?)>>>>>>> [0-9a-f]+', content, re.DOTALL)
if match:
    colored_team_row = match.group(1)
    
    # Remove the entire conflict block from HEAD to >>>>>>> but KEEP the HEAD part!
    # Wait, the HEAD part is what we want to keep in the hero section.
    # The HEAD part is from <<<<<<< HEAD to =======
    head_match = re.search(r'<<<<<<< HEAD\n(.*?)\n=======', content, re.DOTALL)
    if head_match:
        head_content = head_match.group(1)
        
        # Replace the whole conflict block with just the head_content
        content = re.sub(r'<<<<<<< HEAD\n.*?\n=======\n.*?>>>>>>> [0-9a-f]+\n?', head_content + '\n', content, flags=re.DOTALL)
        
        # Now, replace the OLD team row with the colored team row
        # The old team row is inside <section class="team-section py-5">
        # Let's find <div class="row g-4"> inside that section and replace it.
        # It ends right before </div>\n        </div>\n    </section>\n\n    <section class="py-5" style="background-color: #fbf8cc;
        # Let's just find the first <div class="row g-4"> that appears after team-title
        old_team_pattern = r'(<h1 class="fw-bold mb-3 team-title">.*?</p>\s*</div>\s*)<div class="row g-4">.*?</div>\s*</div>\s*</section>'
        # Actually, regex with .*? on large HTML can be tricky. Let's use string operations.
        
        team_header = '<p class="team-subtitle">Un equipo apasionado y comprometido con el bienestar animal</p>\n                    </div>'
        if team_header in content:
            parts = content.split(team_header)
            before = parts[0] + team_header + '\n\n'
            after = parts[1]
            
            # Find where the old team row ends. It ends at the closing of the section.
            # The next section is CORPORATIVO PELUDITOS.
            corp_header = '<section class="py-5" style="background-color: #fbf8cc;'
            if corp_header in after:
                after_parts = after.split(corp_header)
                # We discard the old team row which is in after_parts[0]
                content = before + colored_team_row + '\n        </div>\n    </section>\n\n    ' + corp_header + after_parts[1]
                print("Successfully replaced team row.")
            else:
                print("Could not find Corporativo Peluditos section.")
                
        with open("frontend/index.html", "w", encoding="utf-8") as f:
            f.write(content)
            
        print("Conflict resolved.")
    else:
        print("Could not find HEAD match.")
else:
    print("Could not find conflict markers.")
