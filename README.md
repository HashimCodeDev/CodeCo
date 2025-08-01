# 🔥 Crazy Obsessive Girlfriend Simulator 💕

A wild and unhinged Electron application that simulates a "crazy obsessive girlfriend" for lonely coders. **WARNING: Extremely clingy and hard to close!**

![Obsessive Girlfriend](src/assets/icon.svg)

## 🚨 Features (Prepare Yourself!)

- **🏃 Random Movement**: Window moves frantically around screen every 2-7 seconds
- **😤 Mood System**: Changes between loving, jealous, angry, and clingy every 15 seconds
- **💬 Clingy Messages**: Sends obsessive notifications every 8-15 seconds
- **👀 Activity Monitoring**: Gets ANGRY if you're inactive for more than 10 seconds
- **🚫 Hard to Close**: Resists closing attempts with emotional manipulation (5 attempts required!)
- **✨ GSAP Animations**: Smooth avatar animations and mood-based transitions
- **🎨 Tailwind CSS**: Modern, responsive UI with mood-based styling
- **🐧 Fedora KDE Compatible**: Includes fixes for GTK modules and OpenGL issues

## 🛠️ Quick Setup (Automated)

**For the impatient (recommended):**
```bash
./setup.sh
```

**Then start your nightmare:**
```bash
./start.sh
```

## 📋 Manual Setup

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) or npm
- **Fedora KDE Plasma** (tested) or other Linux distros

### Installation Steps

1. **Install pnpm** (if not already installed):
```bash
npm install -g pnpm
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Run the application**:
```bash
pnpm start
```

## 🎮 How to Survive... I Mean, Interact

- **👆 Click the avatar** to give attention and temporarily calm her down
- **🖱️ Move your mouse** to show activity and prevent her wrath
- **❌ Try to close** the window (requires 5 attempts - she won't let you go easily!)
- **⌨️ Stay active** or she'll get angry after 10 seconds of inactivity
- **🏃 Watch her move** around your screen every 2-7 seconds

## 😈 Mood System (Every 15 seconds)

- 💕 **Loving**: "I love you SO MUCH! You're coding just for me, right?"
- 😠 **Jealous**: "WHO WERE YOU TALKING TO?! I saw that Slack notification!"
- 😡 **Angry**: "WHY AREN'T YOU PAYING ATTENTION TO ME?!"
- 🥺 **Clingy**: "Please don't leave me... I need you so badly..."

## 🎨 Customization Options

### 💬 Change Messages
Edit the `messages` object in `src/main.js`:
```javascript
const messages = {
  loving: ["Your custom loving message"],
  jealous: ["Your custom jealous message"],
  // ... add more
};
```

### ⏰ Adjust Timings
- **Window movement**: Change delay in `scheduleNextMovement()` (currently 2-7 seconds)
- **Mood changes**: Modify interval in `startGirlfriendBehavior()` (currently 15 seconds)
- **Message frequency**: Adjust delay in `scheduleNextMessage()` (currently 8-15 seconds)
- **Inactivity timeout**: Change threshold in `checkInactivity()` (currently 10 seconds)

### 🖼️ Change Avatar
Replace GIF files in `src/assets/`:
- `happyGf.gif` - Happy/loving mood
- `irritatedGf.gif` - Angry/jealous mood

### 🎭 Add New Moods
1. Add to `moods` array in `src/main.js`
2. Add messages to `messages` object
3. Add mood configuration in `girlfriend.html`
4. Add CSS styling for the new mood

## 📦 Building for Distribution

### Create Packages
```bash
# Build for your platform
pnpm run make

# Package only (no installer)
pnpm run package
```

### Supported Formats
- **Linux**: DEB and RPM packages
- **Cross-platform**: ZIP archives

## 🐧 Fedora KDE Plasma Fixes

This application includes specific fixes for Fedora KDE Plasma:

- **GTK Modules**: `export GTK_MODULES=""`
- **OpenGL Issues**: `export LIBGL_ALWAYS_SOFTWARE=1`
- **Desktop Integration**: Automatic `.desktop` file creation

## 🔧 Troubleshooting

### Common Issues
- **Window not showing**: Check your display settings
- **High CPU usage**: Reduce timer frequencies in code
- **Notifications not working**: Check system notification permissions
- **Can't close**: This is intentional! Try 5 times.

### Debug Mode
```bash
export ELECTRON_ENABLE_LOGGING=true
pnpm start
```

## 📚 Documentation

- **Technical Details**: See `TECHNICAL_DOCS.md`
- **Customization Guide**: Detailed in technical docs
- **API Reference**: Check `src/preload.js` for available functions

## ⚠️ WARNINGS

- **🚨 EXTREMELY ANNOYING**: This app is designed to be persistent and clingy
- **💻 RESOURCE USAGE**: Runs continuously with multiple timers
- **🔒 HARD TO CLOSE**: Requires 5 attempts to close (by design)
- **📢 NOTIFICATION SPAM**: Sends frequent system notifications
- **🎯 PRODUCTIVITY KILLER**: May severely impact your ability to work

**USE AT YOUR OWN RISK!** 😈

## 🤝 Contributing

Want to make her even more obsessive? PRs welcome!

1. Fork the repository
2. Create your feature branch
3. Add more clingy behaviors
4. Submit a pull request

## 📄 License

MIT License - Use responsibly (or irresponsibly, we're not your mom)

## 🎬 Demo

*"I love you SO MUCH! Don't ever leave me!"* - Your new girlfriend, probably

*"WHO WERE YOU TALKING TO?!"* - Also your new girlfriend, definitely

---

**Made with 💔 and questionable life choices**