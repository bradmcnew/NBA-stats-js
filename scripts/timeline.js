// timeline.js

// Fetch event data from the JSON file
fetch("data/events.json")
  .then((response) => response.json()) // Convert the response to JSON
  .then((events) => {
    // Access the timeline container in the DOM
    const timeline = document.querySelector(".timeline");

    // Loop through each event in the events array
    events.forEach((event, index) => {
      // Create a div element for each event container
      const container = document.createElement("div");
      container.classList.add("container");

      // Alternate the side of the timeline for each event
      if (index % 2 === 0) {
        container.classList.add("left");
      } else {
        container.classList.add("right");
      }

      // Create a div element for the content
      const content = document.createElement("div");
      content.classList.add("content");

      // Add the event details to the content
      content.innerHTML = `
        <h2>${event.date}</h2>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <img src="../assets/images/${event.image}" alt="${event.title}" style="max-width: 100%;">
      `;

      // Append the content to the container
      container.appendChild(content);

      // Append the container to the timeline
      timeline.appendChild(container);
    });
  })
  .catch((error) => {
    console.error("Error loading event data:", error); // Log error if there's an issue with fetching data
  });
