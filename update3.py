import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Sidebar
sidebar_old = """        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 bg-surface rounded-2xl p-6 flex flex-col gap-8 h-fit">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Категории</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-accent-terra text-white"
                      : "bg-[#FDFBF7] text-main hover:bg-accent-green/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Slider */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Радиус</h3>
              <span className="text-sm text-muted">до 5 км</span>
            </div>
            <Slider defaultValue={[5]} max={20} step={1} />

            <div className="mt-6 flex items-start gap-3 cursor-pointer group">
              <Checkbox id="available-today" className="mt-0.5" />
              <label
                htmlFor="available-today"
                className="text-sm font-medium leading-tight cursor-pointer group-hover:text-accent-terra transition-colors select-none"
              >
                Только со свободными слотами сегодня
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Диапазон цен</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#FDFBF7] rounded-xl px-4 py-2.5 flex items-center">
                <span className="text-muted text-sm mr-2">От</span>
                <input type="number" className="w-full bg-transparent outline-none text-sm" placeholder="0" />
              </div>
              <div className="w-3 h-[2px] bg-muted/30 rounded-full shrink-0" />
              <div className="flex-1 bg-[#FDFBF7] rounded-xl px-4 py-2.5 flex items-center">
                <span className="text-muted text-sm mr-2">До</span>
                <input type="number" className="w-full bg-transparent outline-none text-sm" placeholder="5000" />
              </div>
            </div>
          </div>
        </aside>"""

sidebar_new = """        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5 h-fit">
          {/* Filters */}
          <div className="bg-[#F4EFE6] rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-lg">Фильтры</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[#C59A87] text-white"
                      : "bg-[#FDFBF7] text-main hover:bg-[#C59A87]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Slider */}
          <div className="bg-[#F4EFE6] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Радиус</h3>
              <span className="text-sm text-muted">до 5 км</span>
            </div>
            <Slider defaultValue={[5]} max={20} step={1} />

            <div className="mt-6 flex items-start gap-3 cursor-pointer group">
              <Checkbox id="available-today" className="mt-0.5 border-[#827771]/50 bg-[#FDFBF7] rounded-md data-[state=checked]:bg-[#C59A87] data-[state=checked]:border-[#C59A87]" />
              <label
                htmlFor="available-today"
                className="text-sm font-medium leading-tight cursor-pointer group-hover:text-accent-terra transition-colors select-none"
              >
                Только со свободными слотами сегодня
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-[#F4EFE6] rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-lg">Диапазон цен</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#FDFBF7] rounded-xl px-4 py-2.5 flex items-center">
                <span className="text-muted text-sm mr-2">От</span>
                <input type="number" className="w-full bg-transparent outline-none text-sm" placeholder="0" />
              </div>
              <div className="w-3 h-[2px] bg-muted/30 rounded-full shrink-0" />
              <div className="flex-1 bg-[#FDFBF7] rounded-xl px-4 py-2.5 flex items-center">
                <span className="text-muted text-sm mr-2">До</span>
                <input type="number" className="w-full bg-transparent outline-none text-sm" placeholder="5000" />
              </div>
            </div>
          </div>
        </aside>"""

content = content.replace(sidebar_old, sidebar_new)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
