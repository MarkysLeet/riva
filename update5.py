import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Fix the import warning
content = content.replace(
    'import { MOCK_PLACES, MasterPlace } from "@/lib/mock-data";',
    'import { MOCK_PLACES } from "@/lib/mock-data";'
)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
