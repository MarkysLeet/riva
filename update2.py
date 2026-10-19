import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Main Container
content = content.replace(
    '<main className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">',
    '<main className="max-w-[1200px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">'
)

# Header H1 and subtitle
h1_old = """          <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-serif mb-2">Найдено 124 варианта</h1>
              <p className="text-muted text-sm">Салоны и частные мастера в Анталье</p>
            </div>
          </div>"""

h1_new = """          <div className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="font-sans text-3xl font-bold text-[#2A2421] tracking-tight mb-1">Салоны и мастера поблизости</h1>
              <p className="text-sm text-[#827771] mt-1">Салоны и частные мастера в Анталье</p>
            </div>
          </div>"""

content = content.replace(h1_old, h1_new)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
