import os
import re

files_to_update = [
    "src/Components/Homescreen.jsx",
    "src/Components/Modules.jsx",
    "src/Components/Mdashboard.jsx"
]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Find background pattern and replace it
    content = re.sub(r'background:\s*radial-gradient[^;]*linear-gradient[^;]*;', 'background: ${({ theme }) => theme.bgPattern};', content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(content)

for f in files_to_update:
    process_file(f)

print("Done replacing bgPattern.")
