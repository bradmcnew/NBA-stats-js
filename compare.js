document.addEventListener("DOMContentLoaded", async () => {
  // Get DOM elements
  const player1Select = document.getElementById("player1");
  const player2Select = document.getElementById("player2");
  const player1Card = document.getElementById("player1-card");
  const player2Card = document.getElementById("player2-card");
  const statComparison = document.querySelector(".stat-comparison");

  // Load data
  let players = [];
  let teamColors = {};

  try {
    const [playersData, colorsData] = await Promise.all([
      fetch("players.json").then((response) => response.json()),
      fetch("teamColors.json").then((response) => response.json()),
    ]);

    players = playersData;
    teamColors = colorsData;

    // Populate select dropdowns
    populatePlayerSelects();
  } catch (error) {
    console.error("Error loading data:", error);
  }

  function populatePlayerSelects() {
    const sortedPlayers = [...players].sort((a, b) =>
      a.Player.localeCompare(b.Player)
    );

    sortedPlayers.forEach((player) => {
      const option1 = new Option(player.Player, player.id);
      const option2 = new Option(player.Player, player.id);
      player1Select.add(option1);
      player2Select.add(option2);
    });

    // Set default selections
    player1Select.value = players[0].id;
    player2Select.value = players[1].id;

    updateComparison();
  }

  function updateComparison() {
    const player1 = players.find((p) => p.id === player1Select.value);
    const player2 = players.find((p) => p.id === player2Select.value);

    // Update player cards
    player1Card.innerHTML = createComparisonCard(player1);
    player2Card.innerHTML = createComparisonCard(player2);

    // Update stat comparison
    updateStatComparison(player1, player2);
  }

  function createComparisonCard(player) {
    const colors = teamColors[player.Team] || {
      primary: "#1d428a",
      secondary: "#c8102e",
    };

    return `
      <div class="player-card" style="--team-primary: ${colors.primary}; --team-secondary: ${colors.secondary};">
        <div class="player-header">
          <div class="player-image-container">
            <img src="https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png"
                 alt="${player.Player}"
                 class="player-image"
                 loading="lazy"
                 onerror="this.src='placeholder.jpg'">
          </div>
          <div class="player-info">
            <h2>${player.Player}</h2>
            <p class="player-team">${player.Team}</p>
            <p class="player-meta">Age: ${player.Age} | GP: ${player.GP}</p>
          </div>
        </div>
      </div>
    `;
  }

  function updateStatComparison(player1, player2) {
    const statsToCompare = [
      { key: "PTS", label: "Points", higherBetter: true },
      { key: "AST", label: "Assists", higherBetter: true },
      { key: "REB", label: "Rebounds", higherBetter: true },
      { key: "FG%", label: "FG%", higherBetter: true },
      { key: "3P%", label: "3P%", higherBetter: true },
      { key: "STL", label: "Steals", higherBetter: true },
      { key: "BLK", label: "Blocks", higherBetter: true },
      { key: "Min", label: "Minutes", higherBetter: true },
      { key: "TOV", label: "Turnovers", higherBetter: false },
      { key: "FP", label: "Fantasy Points", higherBetter: true },
    ];

    statComparison.innerHTML = statsToCompare
      .map((stat) => {
        const val1 = player1[stat.key];
        const val2 = player2[stat.key];

        // Determine which value is better based on the stat type
        let player1Better = stat.higherBetter ? val1 > val2 : val1 < val2;
        let player2Better = stat.higherBetter ? val2 > val1 : val2 < val1;

        // Handle equal values
        if (val1 === val2) {
          player1Better = player2Better = false;
        }

        return `
        <div class="stat-row">
          <div class="stat-value ${
            player1Better ? "better" : player2Better ? "worse" : ""
          }">${val1}</div>
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value ${
            player2Better ? "better" : player1Better ? "worse" : ""
          }">${val2}</div>
        </div>
      `;
      })
      .join("");
  }

  // Event listeners
  player1Select.addEventListener("change", updateComparison);
  player2Select.addEventListener("change", updateComparison);
});
