let affection = 100;
let isHarassing = false;

const petSprite = document.getElementById("pet-sprite");
const affectionFill = document.getElementById("affection-fill");

// Update affection display
function updateAffectionDisplay(value) {
	affection = value;
	affectionFill.style.width = `${value}%`;

	if (value <= 30) {
		petSprite.style.filter = "hue-rotate(0deg) saturate(1.5) brightness(0.8)";
	} else if (value <= 60) {
		petSprite.style.filter = "hue-rotate(30deg) saturate(1.2)";
	} else {
		petSprite.style.filter = "none";
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

// Initialize
window.electronAPI.getAffection().then(updateAffectionDisplay);
