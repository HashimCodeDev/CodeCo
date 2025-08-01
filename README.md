# Crazy Obsessive Girlfriend Simulator 💕

A wild and unhinged Electron application that simulates a "crazy obsessive girlfriend" for lonely coders.

## Features

- **Random Movement**: Window moves randomly around screen every 2-7 seconds
- **Mood System**: Changes between loving, jealous, angry, and clingy every 15 seconds
- **Clingy Messages**: Sends frequent notifications with different emotional tones
- **Activity Monitoring**: Gets angry if you're inactive for more than 10 seconds
- **Hard to Close**: Resists closing attempts with emotional manipulation
- **GSAP Animations**: Smooth avatar animations and mood transitions

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Run the application:
```bash
pnpm start
```

## How to Interact

- **Click the avatar** to give attention and calm her down
- **Move your mouse** to show activity and prevent anger
- **Try to close** the window (good luck with that!)

## Moods

- 💕 **Loving**: Happy and affectionate
- 😠 **Jealous**: Suspicious and possessive  
- 😡 **Angry**: Mad about being ignored
- 🥺 **Clingy**: Desperate for attention

## Customization

You can modify the messages, timings, and behaviors in `src/main.js`:

- Change message frequency in `startGirlfriendBehavior()`
- Add new moods and messages in the `moods` and `messages` objects
- Adjust inactivity timeout (currently 10 seconds)
- Modify window movement patterns in `moveWindowRandomly()`

## Building

```bash
pnpm run make
```

## Warning ⚠️

This application is designed to be annoying and persistent. Use at your own risk!