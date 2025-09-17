   <div className="space-y-6 lg:col-span-2">
          {/* Feed */}
          <div className="p-6 space-y-4 border shadow-sm rounded-2xl bg-card">
            <h2 className="text-lg font-semibold">Friends Feed</h2>
            <ul className="space-y-4">
              {feed.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between gap-3 p-4 transition border rounded-xl hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid w-10 h-10 text-xl rounded-full bg-gradient-to-br from-primary/20 to-accent/20 place-items-center">
                      <span>{f.avatar}</span>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-semibold">{f.user}</span> {f.action}
                      </div>
                      <div className="text-xs text-foreground/60">{f.time} ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition">
                      👍 Like
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition">
                      💬 Comment
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini Leaderboard */}
          <div className="p-6 border shadow-sm rounded-2xl bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">🏆 Top Ranks</h2>
              <a
                href="/leaderboard"
                className="text-sm font-medium text-primary hover:underline"
              >
                See all
              </a>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Aarav", avatar: "🦊", points: 980 },
                { name: "Mia", avatar: "🐼", points: 860 },
                { name: "Noah", avatar: "🦁", points: 720 },
              ].map((u, i) => (
                <li
                  key={u.name}
                  className="flex items-center justify-between gap-3 p-4 transition border rounded-xl hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 font-bold text-center text-foreground/60">
                      #{i + 1}
                    </div>
                    <div className="grid w-10 h-10 text-lg rounded-full bg-gradient-to-br from-primary/20 to-accent/20 place-items-center">
                      <span>{u.avatar}</span>
                    </div>
                    <div className="font-medium">{u.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-foreground/60">Points</div>
                    <div className="font-bold">{u.points}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>