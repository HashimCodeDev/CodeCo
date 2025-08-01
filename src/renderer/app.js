class SimpleGirlfriend {
	constructor() {
		this.affection = 75; // Start at 75%
		this.currentMood = "happy";
		this.clickCount = 0;
		this.mischiefTimer = null;
		this.affectionDecayTimer = null;

		this.moods = {
			happy: {
				gif: "happy.gif",
				status: "Feeling Happy 😊",
				threshold: 60,
				color: "mood-happy",
			},
			neutral: {
				gif: "neutral.gif",
				status: "Feeling Okay 😐",
				threshold: 40,
				color: "mood-neutral",
			},
			angry: {
				gif: "angry.gif",
				status: "Getting Angry 😠",
				threshold: 20,
				color: "mood-angry",
			},
			very_angry: {
				gif: "very_angry.gif",
				status: "VERY ANGRY! 🤬",
				threshold: 0,
				color: "mood-very-angry",
			},
		};

		this.init();
	}

	init() {
		this.setupEventListeners();
		this.setupElectronListeners();
		this.startAffectionDecay();
		this.updateDisplay();
	}

	setupEventListeners() {
		// Action buttons
		document.getElementById("rose-btn").addEventListener("click", () => {
			this.giveGift("rose", 15);
		});

		document.getElementById("gift-btn").addEventListener("click", () => {
			this.giveGift("gift", 25);
		});

		document.getElementById("chocolate-btn").addEventListener("click", () => {
			this.giveGift("chocolate", 20);
		});

		// Close button resistance
		document.getElementById("close-btn").addEventListener("click", (e) => {
			e.preventDefault();
			this.resistClosing();
		});

		// Emergency exit (triple-click avatar)
		document.getElementById("avatar").addEventListener("click", () => {
			this.clickCount++;
			if (this.clickCount >= 3) {
				document.getElementById("emergency-exit").classList.remove("hidden");
				setTimeout(() => {
					this.clickCount = 0;
					document.getElementById("emergency-exit").classList.add("hidden");
				}, 5000);
			}
			setTimeout(() => {
				this.clickCount = 0;
			}, 1000);
		});

		// Force quit
		document.getElementById("force-quit").addEventListener("click", () => {
			window.electronAPI.quitApp();
		});
	}

	setupElectronListeners() {
		// Window movement
		window.electronAPI.onWindowMoved(() => {
			this.onWindowMoved();
		});

		// User inactivity
		window.electronAPI.onUserInactive(() => {
			this.handleInactivity();
		});
	}

	giveGift(type, points) {
		this.affection = Math.min(100, this.affection + points);
		this.updateDisplay();
		this.showGiftResponse(type, points);
		this.createFloatingHearts();

		// Reset mischief if affection gets high enough
		if (this.affection > 40 && this.mischiefTimer) {
			this.stopMischief();
		}
	}

	showGiftResponse(type, points) {
		const responses = {
			rose: [
				"Aww, a beautiful rose! Thank you! 🌹💕",
				"You're so sweet! I love roses! 😍",
				"This rose is almost as beautiful as our love! 💖",
			],
			gift: [
				"OMG! A gift for me?! 🎁✨",
				"You spoil me so much! I love it! 😘",
				"Best boyfriend ever! Thank you! 🥰",
			],
			chocolate: [
				"Chocolate! You know the way to my heart! 🍫💕",
				"Yummy! This looks delicious! 😋",
				"Sweet chocolate for your sweet girlfriend! 💖",
			],
		};

		const messages = responses[type];
		const message = messages[Math.floor(Math.random() * messages.length)];

		this.showTemporaryMessage(message);
		this.animateAvatar("bounce");
	}

	showTemporaryMessage(message) {
		// Create floating message
		const messageDiv = document.createElement("div");
		messageDiv.textContent = message;
		messageDiv.className =
			"fixed top-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 z-50";
		document.body.appendChild(messageDiv);

		gsap.fromTo(
			messageDiv,
			{ y: -20, opacity: 0, scale: 0.8 },
			{ y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
		);

		setTimeout(() => {
			gsap.to(messageDiv, {
				y: -20,
				opacity: 0,
				scale: 0.8,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => document.body.removeChild(messageDiv),
			});
		}, 3000);
	}

	createFloatingHearts() {
		const container = document.getElementById("hearts-container");
		const hearts = ["💕", "💖", "💗", "💝", "💘"];

		for (let i = 0; i < 6; i++) {
			setTimeout(() => {
				const heart = document.createElement("div");
				heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
				heart.className = "floating-heart";
				heart.style.left = Math.random() * 200 + "px";
				heart.style.top = Math.random() * 200 + "px";

				container.appendChild(heart);

				setTimeout(() => {
					if (container.contains(heart)) {
						container.removeChild(heart);
					}
				}, 2000);
			}, i * 200);
		}
	}

	startAffectionDecay() {
		this.affectionDecayTimer = setInterval(() => {
			this.affection = Math.max(0, this.affection - 1);
			this.updateDisplay();

			// Start mischief when affection gets low
			if (this.affection <= 20 && !this.mischiefTimer) {
				this.startMischief();
			}
		}, 30000); // Decay 1 point every 30 seconds
	}

	updateDisplay() {
		// Update affection meter
		const bar = document.getElementById("affection-bar");
		const text = document.getElementById("affection-text");
		const status = document.getElementById("affection-status");

		bar.style.width = this.affection + "%";
		text.textContent = this.affection + "%";

		// Update bar color based on affection level
		bar.className = "h-4 rounded-full transition-all duration-1000 ease-out";

		if (this.affection <= 20) {
			bar.classList.add("affection-critical");
			status.textContent = "ANGRY!";
		} else if (this.affection <= 40) {
			bar.classList.add("affection-low");
			status.textContent = "Upset";
		} else if (this.affection <= 70) {
			bar.classList.add("affection-medium");
			status.textContent = "Okay";
		} else {
			bar.classList.add("affection-high");
			status.textContent = "Happy";
		}

		// Update mood based on affection
		this.updateMood();
	}

	updateMood() {
		let newMood = "very_angry";

		for (const mood in this.moods) {
			if (this.affection >= this.moods[mood].threshold) {
				newMood = mood;
				break;
			}
		}

		if (newMood !== this.currentMood) {
			this.changeMood(newMood);
		}
	}

	changeMood(newMood) {
		this.currentMood = newMood;
		const mood = this.moods[newMood];

		// Update GIF
		this.changeAvatarGif(mood.gif);

		// Update status text
		document.getElementById("mood-status").textContent = mood.status;

		// Update avatar styling
		const avatar = document.getElementById("avatar");
		avatar.className = `w-64 h-64 relative ${mood.color}`;

		// Special effects for very low affection
		if (newMood === "very_angry") {
			this.showWarningOverlay();
		} else {
			this.hideWarningOverlay();
		}
	}

	changeAvatarGif(gifName) {
		const avatarGif = document.getElementById("avatar-gif");
		const avatarFallback = document.getElementById("avatar-fallback");

		const newImg = new Image();
		newImg.onload = () => {
			avatarGif.src = `assets/gifs/${gifName}`;
			avatarGif.style.display = "block";
			avatarFallback.style.display = "none";

			// Animate transition
			gsap.fromTo(
				avatarGif,
				{ scale: 0.8, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.5 }
			);
		};

		newImg.onerror = () => {
			avatarGif.style.display = "none";
			avatarFallback.style.display = "flex";
			console.log(`Failed to load GIF: ${gifName}`);
		};

		newImg.src = `assets/gifs/${gifName}`;
	}

	showWarningOverlay() {
		document.getElementById("warning-overlay").classList.remove("hidden");
	}

	hideWarningOverlay() {
		document.getElementById("warning-overlay").classList.add("hidden");
	}

	startMischief() {
		if (this.mischiefTimer) return;

		this.showTemporaryMessage("I'm going to cause some trouble! 😈");

		this.mischiefTimer = setInterval(() => {
			this.causeMischief();
		}, 5000); // Mischief every 5 seconds
	}

	stopMischief() {
		if (this.mischiefTimer) {
			clearInterval(this.mischiefTimer);
			this.mischiefTimer = null;
			this.showTemporaryMessage("Okay, I'll be good now! 😇");
		}
	}

	causeMischief() {
		const mischiefTypes = [
			"shakeScreen",
			"moveWindow",
			"flashScreen",
			"changeCursor",
		];

		const mischief =
			mischiefTypes[Math.floor(Math.random() * mischiefTypes.length)];

		switch (mischief) {
			case "shakeScreen":
				this.shakeScreen();
				break;
			case "moveWindow":
				window.electronAPI.messWithScreen();
				this.showMovementIndicator();
				break;
			case "flashScreen":
				this.flashScreen();
				break;
			case "changeCursor":
				this.changeCursor();
				break;
		}
	}

	shakeScreen() {
		document.getElementById("app").classList.add("screen-shake");
		setTimeout(() => {
			document.getElementById("app").classList.remove("screen-shake");
		}, 500);
	}

	flashScreen() {
		const overlay = document.getElementById("warning-overlay");
		overlay.classList.remove("hidden");
		overlay.style.backgroundColor = "rgba(239, 68, 68, 0.3)";

		setTimeout(() => {
			overlay.classList.add("hidden");
			overlay.style.backgroundColor = "";
		}, 300);
	}

	changeCursor() {
		document.body.classList.add("cursor-chaos");
		setTimeout(() => {
			document.body.classList.remove("cursor-chaos");
		}, 3000);
	}

	showMovementIndicator() {
		const indicator = document.createElement("div");
		indicator.textContent = "I moved the window! 😈";
		indicator.className = "movement-indicator";
		document.body.appendChild(indicator);

		setTimeout(() => {
			if (document.body.contains(indicator)) {
				document.body.removeChild(indicator);
			}
		}, 2000);
	}

	animateAvatar(type) {
		const avatar = document.getElementById("avatar");

		switch (type) {
			case "bounce":
				gsap.to(avatar, {
					duration: 0.6,
					y: -20,
					yoyo: true,
					repeat: 1,
					ease: "power2.out",
				});
				break;
			case "pulse":
				gsap.to(avatar, {
					duration: 0.3,
					scale: 1.1,
					yoyo: true,
					repeat: 3,
					ease: "power2.inOut",
				});
				break;
		}
	}

	onWindowMoved() {
		if (this.affection <= 20) {
			this.showTemporaryMessage("Hehe! Can't catch me! 😈");
		}
	}

	handleInactivity() {
		this.affection = Math.max(0, this.affection - 5);
		this.updateDisplay();
		this.showTemporaryMessage("Hey! Pay attention to me! 😤");
	}

	resistClosing() {
		if (this.affection > 50) {
			this.showTemporaryMessage("Aww, do you really have to go? 🥺");
		} else {
			this.showTemporaryMessage("You're NOT leaving me! 😡");
			this.shakeScreen();
		}
	}
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
	new SimpleGirlfriend();
});
