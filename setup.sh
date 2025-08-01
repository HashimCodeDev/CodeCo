#!/bin/bash

echo "🔥 Setting up Crazy Obsessive Girlfriend Simulator 💕"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install

# Fix potential Fedora KDE Plasma issues
echo "🔧 Configuring for Fedora KDE Plasma compatibility..."

# Create desktop entry
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/crazy-girlfriend-simulator.desktop << EOF
[Desktop Entry]
Name=Crazy Girlfriend Simulator
Comment=A wild and unhinged girlfriend simulator for lonely coders
Exec=$(pwd)/start.sh
Icon=$(pwd)/src/assets/girlfriend.svg
Terminal=false
Type=Application
Categories=Game;Entertainment;
EOF

# Create start script with environment fixes
cat > start.sh << 'EOF'
#!/bin/bash
export ELECTRON_DISABLE_SECURITY_WARNINGS=true
export ELECTRON_ENABLE_LOGGING=true
export DISPLAY=:0

# Fix GTK modules issue on Fedora
export GTK_MODULES=""

# Fix OpenGL issues
export LIBGL_ALWAYS_SOFTWARE=1

# Start the application
cd "$(dirname "$0")"
pnpm start
EOF

chmod +x start.sh

echo "✅ Setup complete!"
echo ""
echo "🚀 To start your crazy girlfriend:"
echo "   ./start.sh"
echo ""
echo "⚠️  WARNING: This application is designed to be extremely annoying!"
echo "   Use at your own risk! 😈"
echo ""
echo "💡 Customization tips:"
echo "   - Edit src/main.js to change behaviors and messages"
echo "   - Replace GIFs in src/assets/ to change the avatar"
echo "   - Adjust timings and frequencies in the code"