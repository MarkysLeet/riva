import re

with open("src/app/page.tsx", "r") as f:
    content = f.read()

# Grid container
grid_old = """          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >"""

grid_new = """          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >"""

content = content.replace(grid_old, grid_new)

# Card interior
card_old = """                <div className="p-6 flex flex-col flex-1">
                  {/* Header / Meta */}
                  <div className="flex items-start gap-4 mb-4">
                    {place.type === "solo" && place.avatar && (
                      <img src={place.avatar} alt={place.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold">{place.name}</h2>
                        {place.type === "solo" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted hover:text-accent-terra transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-muted text-sm mb-2">{place.specialization}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent-terra text-accent-terra" />
                          <span>{place.rating}</span>
                          <span className="text-muted font-normal">({place.reviews})</span>
                        </div>
                        <div className="text-muted font-normal">• {place.distance} км</div>
                      </div>
                    </div>
                  </div>

                  {/* Price info for solo */}
                  {place.type === "solo" && place.priceStart && (
                    <div className="text-sm font-medium mb-4">
                      Маникюр с покрытием • <span className="text-muted">от {place.priceStart} TL</span>
                    </div>
                  )}

                  {/* Time Slots */}
                  <div className="mt-2 mb-6">
                    <div className="text-sm font-medium mb-3">Свободны сегодня</div>
                    <div className="flex gap-2">
                      {place.slots.map((slot, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            slot.available
                              ? "bg-accent-green text-main"
                              : "bg-surface text-muted cursor-not-allowed opacity-60"
                          }`}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-surface flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {place.type === "salon" && place.deposit && (
                        <span className="text-sm font-medium">Депозит: {place.deposit} TL</span>
                      )}
                      {place.type === "solo" && place.tags?.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-md ${tag === "Депозит" ? "bg-accent-terra/20 text-accent-terra" : "bg-surface text-main"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-accent-terra text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                      Записаться
                    </motion.button>
                  </div>
                </div>"""

card_new = """                <div className="p-5 flex flex-col gap-4">
                  {/* Header / Meta */}
                  <div className="flex items-start gap-4">
                    {place.type === "solo" && place.avatar && (
                      <img src={place.avatar} alt={place.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold">{place.name}</h2>
                        {place.type === "solo" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted hover:text-accent-terra transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                      <p className="text-muted text-sm mb-2">{place.specialization}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent-terra text-accent-terra" />
                          <span>{place.rating}</span>
                          <span className="text-muted font-normal">({place.reviews})</span>
                        </div>
                        <div className="text-muted font-normal">• {place.distance} км</div>
                      </div>
                    </div>
                  </div>

                  {/* Price info for solo */}
                  {place.type === "solo" && place.priceStart && (
                    <div className="text-sm font-medium">
                      Маникюр с покрытием • <span className="text-muted">от {place.priceStart} TL</span>
                    </div>
                  )}

                  {/* Time Slots */}
                  <div>
                    <div className="text-sm font-medium mb-3">Свободны сегодня</div>
                    <div className="flex gap-2">
                      {place.slots.map((slot, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            slot.available
                              ? "bg-accent-green text-main"
                              : "bg-surface text-muted cursor-not-allowed opacity-60"
                          }`}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-[#EFEAE0] flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {place.type === "salon" && place.deposit && (
                        <span className="text-sm font-medium">Депозит: {place.deposit} TL</span>
                      )}
                      {place.type === "solo" && place.tags?.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded-md ${tag === "Депозит" ? "bg-[#C59A87]/20 text-[#C59A87]" : "bg-[#F4EFE6] text-[#2A2421]"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 px-5 rounded-full bg-[#C59A87] text-white text-sm font-medium inline-flex items-center justify-center"
                    >
                      Записаться
                    </motion.button>
                  </div>
                </div>"""

content = content.replace(card_old, card_new)

with open("src/app/page.tsx", "w") as f:
    f.write(content)
