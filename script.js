document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");

  fetch("players.json")
    .then((response) => response.json())
    .then((players) => {
      players.forEach((player) => {
        const card = createPlayerCard(player);
        gallery.appendChild(card);
      });
    })
    .catch((error) => console.error("Error loading players:", error));

  function createPlayerCard(player) {
    const card = document.createElement("div");
    card.className = "player-card";
    card.tabIndex = 0;

    // Calculate efficiency and shooting percentages
    const effRating = (
      (player.PTS + player.REB + player.AST) /
      player.Min
    ).toFixed(2);
    const trueShootingPct = (
      (player.PTS / (2 * (player.FGA + 0.44 * player.FTA))) *
      100
    ).toFixed(1);

    card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span class="flip-icon" aria-hidden="true">↻</span>
                    <div class="player-header">
                        <img src="https://cdn.nba.com/headshots/nba/latest/1040x760/${getPlayerImageId(
                          player.Player
                        )}.png"
                             alt="${player.Player}"
                             class="player-image"
                             onerror="this.src='placeholder.jpg'">
                        <div class="player-info">
                            <h2>${player.Player}</h2>
                            <p class="player-team">${player.Team}</p>
                            <p class="player-meta">Age: ${player.Age} | GP: ${
      player.GP
    }</p>
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
                                    <span class="mini-value">${
                                      player.STL
                                    }</span>
                                    <span class="mini-label">STL</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${
                                      player.BLK
                                    }</span>
                                    <span class="mini-label">BLK</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${
                                      player.TOV
                                    }</span>
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
                                <span class="record-value">${player.W}-${
      player.L
    }</span>
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

    // Add event listeners for card flipping
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    // Add keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("flipped");
      }
    });

    return card;
  }

  // Helper function to get player image IDs (you'll need to maintain a mapping of players to their NBA.com image IDs)
  function getPlayerImageId(playerName) {
    const playerIds = {
      "Giannis Antetokounmpo": "203507",
      "LaMelo Ball": "1630163",
      "Nikola Jokić": "203999",
      "Shai Gilgeous-Alexander": "1628983",
      "Anthony Davis": "203076",
      "Paolo Banchero": "1631094",
      "Jayson Tatum": "1628369",
      "Luka Dončić": "1629029",
      "Anthony Edwards": "1630162",
      "De'Aaron Fox": "1628368",
      "Kevin Durant": "201142",
      "Karl-Anthony Towns": "1626157",
      "Damian Lillard": "203081",
      "Tyrese Maxey": "1630178",
      "Jalen Brunson": "1628973",
      "Jaylen Brown": "1627759",
      "Donovan Mitchell": "1628378",
      "Cam Thomas": "1630560",
      "Devin Booker": "1626164",
      "Kyrie Irving": "202681",
      "Tyler Herro": "1629639",
      "Cade Cunningham": "1630595",
      "Victor Wembanyama": "1641705",
      "Franz Wagner": "1630532",
      "Norman Powell": "1626181",
      "LeBron James": "2544",
      "Brandon Ingram": "1627742",
      "RJ Barrett": "1629628",
      "Zion Williamson": "1629627",
      "DeMar DeRozan": "201942",
    };
    return playerIds[playerName] || "1";
  }
});
