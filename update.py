import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Header update
content = content.replace(
    '<div className="container mx-auto px-6 h-20 flex items-center justify-between">',
    '<div className="max-w-[1200px] w-full mx-auto px-6 h-20 flex items-center justify-between">'
)

search_bar_old = """          {/* Search Bar & City */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-8">
            <div className="flex-1 flex items-center bg-[#EFEAE0] rounded-full px-4 py-2.5">
              <Search className="w-4 h-4 text-muted mr-3" />
              <input
                type="text"
                placeholder="Поиск салонов, мастеров или услуг"
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted"
              />
            </div>
            <div className="flex items-center gap-1 cursor-pointer group">
              <span className="text-sm font-medium">Анталья</span>
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-main transition-colors" />
            </div>
          </div>"""

search_bar_new = """          {/* Search Bar & City */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center mx-8">
            <div className="max-w-md w-full flex items-center bg-[#F0EAE1] h-10 rounded-full px-4">
              <Search className="w-4 h-4 text-muted mr-3" />
              <input
                type="text"
                placeholder="Поиск салонов, мастеров или услуг"
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted"
              />
            </div>
            <div className="flex items-center gap-1 cursor-pointer group shrink-0">
              <span className="text-sm font-medium">Анталья</span>
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-main transition-colors" />
            </div>
          </div>"""

content = content.replace(search_bar_old, search_bar_new)

auth_buttons_old = """          {/* Auth */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-full border border-accent-terra text-main text-sm font-medium transition-colors hover:bg-accent-terra/5"
            >
              Войти
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-1.5 text-sm rounded-full bg-[#C59A87] text-white font-medium transition-colors hover:bg-[#b08876]"
            >
              Зарегистрироваться
            </motion.button>
          </div>"""

auth_buttons_new = """          {/* Auth */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="h-10 px-5 text-sm font-medium rounded-full inline-flex items-center justify-center transition-colors cursor-pointer border border-[#C59A87] text-[#2A2421] bg-transparent hover:bg-[#F4EFE6]"
            >
              Войти
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="h-10 px-5 text-sm font-medium rounded-full inline-flex items-center justify-center transition-colors cursor-pointer bg-[#C59A87] text-white border border-transparent hover:bg-[#b58976]"
            >
              Зарегистрироваться
            </motion.button>
          </div>"""

content = content.replace(auth_buttons_old, auth_buttons_new)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
