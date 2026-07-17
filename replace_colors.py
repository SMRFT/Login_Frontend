import os
import re

files_to_update = [
    "src/Components/Login.jsx",
    "src/Components/Homescreen.jsx",
    "src/Components/Modules.jsx",
    "src/Components/Mdashboard.jsx",
    "src/Components/BirthdayModal.jsx"
]

replacements = {
    r"#FFFFFF": "${({ theme }) => theme.bgCard}",
    r"#2B2230": "${({ theme }) => theme.textPrimary}",
    r"#8A7684": "${({ theme }) => theme.textSecondary}",
    r"#6B5A66": "${({ theme }) => theme.textSecondary}",
    r"#4A3A46": "${({ theme }) => theme.textPrimary}",
    r"#5C4B57": "${({ theme }) => theme.textSecondary}",
    r"#BFAFB9": "${({ theme }) => theme.textMuted}",
    
    # Brands
    r"#D9538F": "${({ theme }) => theme.brandMain}",
    r"#A83A6E": "${({ theme }) => theme.brandSecondary}",
    r"#C94F87": "${({ theme }) => theme.brandSecondary}",
    r"#1E8A7D": "${({ theme }) => theme.brandTertiary}",
    r"#2BB3A3": "${({ theme }) => theme.brandTertiary}",
    r"#EBDDE5": "${({ theme }) => theme.borderLight}",
    
    # Gradients and specific rgba
    r"rgba\(255, 255, 255, 0.75\)": "${({ theme }) => theme.bgOverlay}",
    r"rgba\(201, 79, 135, 0.14\)": "${({ theme }) => theme.borderActive}",
    r"rgba\(201, 79, 135, 0.10\)": "${({ theme }) => theme.borderActive}",
    r"rgba\(201, 79, 135, 0.12\)": "${({ theme }) => theme.borderActive}",
    r"rgba\(201, 79, 135, 0.16\)": "${({ theme }) => theme.borderActive}",
    r"rgba\(201, 79, 135, 0.2\)": "${({ theme }) => theme.borderActive}",
    r"linear-gradient\(135deg, #D9538F, #A83A6E\)": "${({ theme }) => theme.gradientPrimary}",
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    for pattern, repl in replacements.items():
        content = re.sub(pattern, repl, content, flags=re.IGNORECASE)
        
    # Fix nested templates where we might have substituted inside an existing interpolation
    # This regex is naive, just testing if it works generally
    
    with open(filepath, 'w') as f:
        f.write(content)

for f in files_to_update:
    process_file(f)

print("Done replacing colors.")
