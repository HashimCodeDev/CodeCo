let affection = 100;
let isHarassing = false;

const petSprite = document.getElementById("pet-sprite");
const affectionFill = document.getElementById("affection-fill");

// Update affection display
function updateAffectionDisplay(value) {
	affection = value;
	affectionFill.style.width = `${value}%`;

	if (value <= 30) {
		petSprite.src = "./assets/irritatedGf.gif";
	} else {
		petSprite.src = "./assets/happyGf.gif";
	}
}

// Handle pet click
petSprite.addEventListener("click", async () => {
	const newAffection = await window.electronAPI.feedPet();
	updateAffectionDisplay(newAffection);

	// Visual feedback
	petSprite.style.transform = "scale(1.3)";
	setTimeout(() => {
		petSprite.style.transform = "scale(1)";
	}, 200);
});

// Keep sprite always clickable
window.electronAPI.setClickable(true);

// IPC event listeners
window.electronAPI.onAffectionUpdate((event, value) => {
	updateAffectionDisplay(value);
});

window.electronAPI.onStartHarassment(() => {
	if (!isHarassing) {
		isHarassing = true;
		petSprite.classList.add("shake");
	}
});

window.electronAPI.onStopHarassment(() => {
	if (isHarassing) {
		isHarassing = false;
		petSprite.classList.remove("shake");
	}
});

// GSAP animations for interactions
window.giveItem = function(item) {
  const gf = document.getElementById('pet-sprite');
  if (item === 'rose') {
    gf.style.transform = 'scale(1.2)';
    setTimeout(() => gf.style.transform = 'scale(1)', 500);
    alert('Girlfriend smiles happily!');
  } else if (item === 'gift') {
    gf.style.transform = 'translateY(-20px)';
    setTimeout(() => gf.style.transform = 'translateY(0)', 300);
    alert('Girlfriend jumps with joy!');
  } else if (item === 'chocolate') {
    gf.style.transform = 'rotate(10deg)';
    setTimeout(() => gf.style.transform = 'rotate(0deg)', 300);
    alert('Girlfriend blushes!');
  }
};

// Wandering functionality
let isWandering = false;
function wander() {
  if (!isWandering) return;
  const gf = document.getElementById('pet-sprite');
  const maxX = window.innerWidth - 120;
  const maxY = window.innerHeight - 120;
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  gf.style.transition = 'all 2s ease-in-out';
  gf.style.left = newX + 'px';
  gf.style.top = newY + 'px';
  setTimeout(wander, 3000);
}

window.toggleWander = function() {
  isWandering = !isWandering;
  if (isWandering) {
    wander();
  } else {
    const gf = document.getElementById('pet-sprite');
    gf.style.transition = 'none';
  }
};

// Initialize
window.electronAPI.getAffection().then(updateAffectionDisplay);
