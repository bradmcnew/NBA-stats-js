document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const gallery = document.querySelector(".gallery");
  const statFilter = document.getElementById("stat-filter");

  // State management
  let currentPlayers = [];
  let teamColors = {};

  // Fetch and initialize data from JSON files
  async function initializeData() {
    try {
      const [players, colors] = await Promise.all([
        fetch("players.json").then((response) => response.json()),
        fetch("teamColors.json").then((response) => response.json()),
      ]);

      currentPlayers = players;
      teamColors = colors;
      renderPlayers(currentPlayers);

      // Initialize stat filter functionality
      statFilter.addEventListener("change", () => {
        const sortedPlayers = [...currentPlayers].sort((a, b) => {
          const statA = parseFloat(a[statFilter.value]);
          const statB = parseFloat(b[statFilter.value]);
          return statB - statA; // Sort in descending order
        });
        renderPlayers(sortedPlayers);
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  initializeData();

  /**
   * Renders all player cards in the gallery
   * @param {Array} players - Array of player objects to render
   */
  function renderPlayers(players) {
    gallery.innerHTML = "";
    players.forEach((player) => {
      const card = createPlayerCard(player);
      gallery.appendChild(card);
    });
  }

  // Creates a player card element with stats and styling
  function createPlayerCard(player) {
    const card = document.createElement("div");
    card.className = "player-card";
    card.tabIndex = 0;

    // Fallback team colors
    const colors = teamColors[player.Team] || {
      primary: "#1d428a",
      secondary: "#c8102e",
    };

    // Converts hex color to RGB values
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // Convert team colors for CSS variables
    const secondaryRgb = hexToRgb(colors.secondary);
    const rgbString = `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`;

    // Apply team colors to card
    card.style.setProperty("--team-primary", colors.primary);
    card.style.setProperty("--team-secondary", colors.secondary);
    card.style.setProperty("--team-secondary-rgb", rgbString);

    // Calculate advanced statistics
    const trueShootingPct = (
      (player.PTS / (2 * (player.FGA + 0.44 * player.FTA))) *
      100
    ).toFixed(1);

    // Generate card HTML structure
    card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span class="flip-icon" aria-hidden="true">↻</span>
                    <div class="player-header">
                        <div class="player-image-container">
                            <div class="image-skeleton"></div>
                            <img src="https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png"
                                 alt="${player.Player}"
                                 class="player-image"
                                 loading="lazy"
                                 onload="this.classList.add('loaded')"
                                 onerror="this.src='placeholder.jpg'">
                        </div>
                        <div class="player-info">
                            <h2>${player.Player}</h2>
                            <p class="player-team">${player.Team}</p>
                            <p class="player-meta">Age: ${player.Age} | GP: ${player.GP}</p>
                        </div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">${player.PTS}</div>
                            <div class="stat-label">PPG</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.AST}</div>
                            <div class="stat-label">APG</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.REB}</div>
                            <div class="stat-label">RPG</div>
                        </div>
                    </div>
                    <div class="additional-stats">
                        <div class="stat-row">
                            <div class="stat-group">
                                <div class="mini-stat">
                                    <span class="mini-value">${player.STL}</span>
                                    <span class="mini-label">STL</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${player.BLK}</span>
                                    <span class="mini-label">BLK</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${player.TOV}</span>
                                    <span class="mini-label">TOV</span>
                                </div>
                            </div>
                        </div>
                        <div class="stat-row second-row">
                            <div class="mini-stat minutes">
                                <span class="mini-value">${player.Min}</span>
                                <span class="mini-label">MIN</span>
                            </div>
                            <div class="record-stat">
                                <span class="record-value">${player.W}-${player.L}</span>
                                <span class="record-label">Record</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-back">
                    <span class="flip-icon" aria-hidden="true">↻</span>
                    <h3>Advanced Stats</h3>
                    <div class="advanced-stats">
                        <div class="advanced-stat-item">
                            <div class="stat-value">${trueShootingPct}</div>
                            <div class="stat-label">TS%</div>
                        </div>
                        <div class="advanced-stat-item">
                            <div class="stat-value">${player.FP}</div>
                            <div class="stat-label">FP</div>
                        </div>
                        <div class="advanced-stat-item">
                            <div class="stat-value">${player["+/-"]}</div>
                            <div class="stat-label">+/-</div>
                        </div>
                    </div>
                    <div class="shooting-splits">
                        <div class="split-item">
                            <div class="split-value">${player["FG%"]}</div>
                            <div class="split-label">FG%</div>
                        </div>
                        <div class="split-item">
                            <div class="split-value">${player["3P%"]}</div>
                            <div class="split-label">3P%</div>
                        </div>
                        <div class="split-item">
                            <div class="split-value">${player["FT%"]}</div>
                            <div class="split-label">FT%</div>
                        </div>
                    </div>
                    <div class="player-achievements">
                        <p>Double-Doubles: ${player.DD2}</p>
                        <p>Triple-Doubles: ${player.TD3}</p>
                    </div>
                </div>
            </div>
        `;

    // Add interactivity
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    // Add keyboard accessibility
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("flipped");
      }
    });

    return card;
  }
});
