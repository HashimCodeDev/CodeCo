# 🔥 Crazy Obsessive Girlfriend Simulator - Technical Documentation 💕

## 🚀 Features Implementation

### 1. Random Window Movement (2-7 seconds)
**Location**: `src/main.js` - `moveWindowRandomly()` function
- Uses `setTimeout` with random delays between 2000-7000ms
- Mood-based movement patterns:
  - **Angry**: Frantic movement across entire screen
  - **Clingy**: Stays near screen center
  - **Normal**: Corners and edges positioning
- Ensures window stays within screen bounds

### 2. Clingy Messages System
**Location**: `src/main.js` - `messages` object and `sendMessage()` function
- 5 different messages per mood (20 total messages)
- Sends notifications every 8-15 seconds (random interval)
- Uses Electron's `Notification` API
- Messages get more intense based on mood

### 3. Mood System (15-second cycles)
**Location**: `src/main.js` - `changeMood()` function
- 4 moods: loving, jealous, angry, clingy
- Changes every 15 seconds automatically
- Affects window movement patterns
- Changes avatar appearance and animations
- Influences message tone and frequency

### 4. Activity Monitoring (10-second timeout)
**Location**: `src/main.js` - `checkInactivity()` function
- Tracks user activity every 2 seconds
- Triggers angry mode after 10 seconds of inactivity
- Gets more aggressive after 20 seconds:
  - Forces window to front
  - Increases movement frequency
  - Shows window if hidden

### 5. Hard to Close System
**Location**: `src/main.js` - window 'close' event handler
- Prevents closing with emotional manipulation dialogs
- 5 different resistance messages
- Only allows closing after 5 attempts
- Shows final "I'll be back" message
- Handles minimize events with jealous reactions

### 6. GSAP Animations
**Location**: `src/girlfriend.html` - JavaScript section
- Smooth avatar scaling and rotation
- Mood-based animation patterns
- Message bubble animations
- Idle breathing animation
- Click interaction feedback

## 🛠️ Customization Guide

### Changing Messages
Edit the `messages` object in `src/main.js`:
```javascript
const messages = {
  loving: ["Your custom loving message", "Another loving message"],
  jealous: ["Your jealous message"],
  angry: ["Your angry message"],
  clingy: ["Your clingy message"]
};
```

### Adjusting Timings
In `startGirlfriendBehavior()` function:
```javascript
// Window movement (currently 2-7 seconds)
const delay = Math.random() * 5000 + 2000;

// Mood changes (currently 15 seconds)
moodTimer = setInterval(() => { changeMood(); }, 15000);

// Messages (currently 8-15 seconds)
const delay = Math.random() * 7000 + 8000;

// Inactivity check (currently 10 seconds)
if (Date.now() - lastActivity > 10000) { ... }
```

### Changing Avatar
Replace files in `src/assets/`:
- `happyGf.gif` - Happy/loving mood avatar
- `irritatedGf.gif` - Angry/jealous mood avatar

### Adding New Moods
1. Add to `moods` array in `src/main.js`
2. Add messages to `messages` object
3. Add mood configuration in `girlfriend.html`
4. Add CSS class for mood styling

### Window Behavior
Modify `moveWindowRandomly()` function:
```javascript
// Change movement patterns
const positions = [
  { x: 50, y: 50 },     // top-left
  { x: centerX, y: centerY }, // center
  // Add your custom positions
];
```

## 🔧 Fedora KDE Plasma Compatibility

### GTK Modules Fix
The application includes environment variable fixes:
```bash
export GTK_MODULES=""
export LIBGL_ALWAYS_SOFTWARE=1
```

### OpenGL Issues
Software rendering fallback is enabled to prevent crashes on some systems.

### Desktop Integration
The setup script creates a proper `.desktop` file for system integration.

## 📦 Build Configuration

### Electron Forge Setup
- **Makers**: DEB, RPM, ZIP packages
- **Auto-unpack natives**: Enabled for better performance
- **ASAR**: Enabled for code protection
- **Fuses**: Security hardening enabled

### Building Commands
```bash
# Development
pnpm start

# Package for distribution
pnpm run make

# Package only (no installer)
pnpm run package
```

## 🎨 UI/UX Features

### Tailwind CSS Integration
- Responsive design
- Gradient backgrounds for moods
- Smooth transitions
- Modern button styling

### GSAP Animations
- Smooth scaling and rotation
- Easing functions for natural movement
- Chained animations for complex sequences
- Performance-optimized transforms

### Mood Visual Indicators
- Color-coded backgrounds
- Animated avatar changes
- Message bubble styling
- Mood text display

## 🔒 Security Considerations

### Context Isolation
- Enabled for security
- IPC communication through preload script
- No direct Node.js access from renderer

### Code Protection
- ASAR packaging
- Fuses for runtime security
- Integrity validation

## 🐛 Troubleshooting

### Common Issues
1. **Window not showing**: Check display settings and screen resolution
2. **Animations not working**: Verify GSAP CDN connection
3. **Messages not appearing**: Check notification permissions
4. **High CPU usage**: Adjust timer intervals in code

### Debug Mode
Enable debug logging:
```bash
export ELECTRON_ENABLE_LOGGING=true
```

### Performance Optimization
- Reduce animation frequency
- Increase timer intervals
- Disable transparency if needed

## 🎯 Advanced Customization

### Adding Sound Effects
1. Add audio files to `src/assets/`
2. Create Audio objects in renderer
3. Play sounds on mood changes/interactions

### Network Integration
- Add web API calls for dynamic messages
- Implement remote configuration
- Add update checking

### Multi-Monitor Support
- Detect all displays
- Random monitor selection
- Cross-monitor movement

### Persistence
- Save user preferences
- Remember interaction history
- Mood learning system

## ⚠️ Warnings and Disclaimers

- **Resource Usage**: Application runs continuously with timers
- **User Experience**: Designed to be intentionally annoying
- **System Impact**: May affect productivity (by design)
- **Closing Difficulty**: Requires multiple attempts to close
- **Notification Spam**: Frequent system notifications

## 🔄 Version History

- **v1.0.0**: Initial release with all core features
- Mood system, random movement, clingy messages
- Hard-to-close functionality, GSAP animations
- Fedora KDE Plasma compatibility fixes