#!/bin/bash

echo "🔥 Starting Crazy Obsessive Girlfriend Simulator 💕"
echo "=================================================="

# Fedora KDE Plasma compatibility fixes
export ELECTRON_DISABLE_SECURITY_WARNINGS=true
export ELECTRON_ENABLE_LOGGING=false
export DISPLAY=:0

# Fix GTK modules issue on Fedora
export GTK_MODULES=""

# Fix OpenGL issues
export LIBGL_ALWAYS_SOFTWARE=1

# Disable GPU acceleration if needed
export ELECTRON_DISABLE_GPU=false

echo "🔧 Environment configured for Fedora KDE Plasma"
echo "⚠️  WARNING: Your girlfriend is about to become VERY clingy!"
echo ""
echo "💡 Tips:"
echo "   - Click her avatar to calm her down"
echo "   - Stay active or she'll get angry"
echo "   - Closing requires 5 attempts (she's persistent!)"
echo ""
echo "🚀 Launching in 3 seconds..."
sleep 1
echo "3..."
sleep 1
echo "2..."
sleep 1
echo "1..."
echo ""
echo "💕 Here she comes! Good luck! 😈"

# Start the application
pnpm start