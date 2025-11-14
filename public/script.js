window.addEventListener("scroll", function () {
  const header = document.getElementById("header");

  if (window.scrollY > 10) {
    header.classList.add("glass-header");
  } else {
    header.classList.remove("glass-header");
  }
});


window.addEventListener("load", () => {
  const title = document.getElementById("title");
  const items = document.querySelectorAll(".solution-item");

  // Show title once
  setTimeout(() => title.classList.add("show"), 300);

  let index = 0;

  function cycleItems() {
    // Hide all
    items.forEach(item => item.classList.remove("show"));

    // Show current
    items[index].classList.add("show");

    // Move to next item
    index = (index + 1) % items.length;

    // Repeat
    setTimeout(cycleItems, 2000);
  }

  // Start after initial delay
  setTimeout(cycleItems, 1000);
});

window.addEventListener("load", () => {
    const title = document.querySelector(".how-title");
    const steps = document.querySelectorAll(".step");

    setTimeout(() => {
      title.classList.add("show");
    }, 300);

    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add("show");
      }, 800 + index * 500);
    });
  });

  const compareBox = document.getElementById("compareBox");

  const dataItems = [
    "🧅 Onion - ₹24/kg - 2 km",
    "🥔 Potato - ₹18/kg - 1.5 km",
    "🍅 Tomato - ₹26/kg - 2.2 km",
    "🫑 Capsicum - ₹40/kg - 1.8 km",
    "🧄 Garlic - ₹120/kg - 3.1 km"
  ];

  let currentIndex = 0;

  function updateCompareBox() {
    compareBox.innerHTML = `<span class="compare-item">${dataItems[currentIndex]}</span>`;
    currentIndex = (currentIndex + 1) % dataItems.length;
  }

  // Initial call and loop
  updateCompareBox();
  setInterval(updateCompareBox, 2500); // Change every 2.5 seconds

        
        