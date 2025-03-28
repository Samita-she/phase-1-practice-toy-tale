let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => toys.forEach(toy => renderToy(toy)))
      .catch(error => console.error("Error fetching toys:", error));
  }

  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.textContent = "Like ❤️";
    button.addEventListener("click", () => handleLikeButtonClick(toy, card));

    card.append(h2, img, p, button);
    toyCollection.appendChild(card);
  }

  function handleLikeButtonClick(toy, card) {
    const likesElement = card.querySelector("p");
    const newLikes = toy.likes + 1;

    likesElement.textContent = `${newLikes} Likes`;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => {
        console.log("PATCH Response:", response);
        if (!response.ok) throw new Error("Failed to update likes");
        return response.json();
      })
      .then(updatedToy => toy.likes = updatedToy.likes)
      .catch(error => {
        console.error("Error updating likes:", error);
        likesElement.textContent = `${toy.likes} Likes`;
      });
  }

  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(newToyData => {
        renderToy(newToyData);
        toyForm.reset();
      })
      .catch(error => console.error("Error adding toy:", error));
  });

  fetchToys();
});
