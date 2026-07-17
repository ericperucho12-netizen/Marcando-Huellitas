import re

with open("frontend/index.html", "r", encoding="utf-8") as f:
    content = f.read()

def replace_social_icon(match):
    href = match.group(1)
    rest_of_tag = match.group(2)
    
    # Fix www. -> https://www.
    if href.startswith("www."):
        href = "https://" + href
        
    # Ensure it has target="_blank"
    if 'target="_blank"' not in rest_of_tag:
        # We can just insert target="_blank" rel="noopener noreferrer"
        return f'<a href="{href}" target="_blank" rel="noopener noreferrer" {rest_of_tag}'
    return match.group(0)

# The regex matches <a href="([^"]+)" ([^>]*class="social-icon"[^>]*)>
# or similar, but the formatting in HTML might have newlines.
# Let's do a more robust approach.

def process_a_tags(html):
    # Find all <a> tags that have class="social-icon"
    # we need to be careful with newlines inside tags
    pattern = re.compile(r'<a\s+href="([^"]+)"([^>]*class="social-icon"[^>]*)>', re.IGNORECASE | re.DOTALL)
    
    def replacer(m):
        href = m.group(1).strip()
        rest = m.group(2)
        
        if href.startswith("www."):
            href = "https://" + href
            
        if 'target="_blank"' not in rest:
            return f'<a href="{href}" target="_blank" rel="noopener noreferrer"{rest}>'
        
        return f'<a href="{href}"{rest}>'
        
    return pattern.sub(replacer, html)

new_content = process_a_tags(content)

with open("frontend/index.html", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Links and targets updated in index.html")
