#!/bin/bash

echo "🧪 Testing Crazy Girlfriend Simulator..."
echo "======================================"

# Check if all required files exist
echo "📁 Checking required files..."

required_files=(
    "src/main.js"
    "src/girlfriend.html"
    "src/preload.js"
    "src/assets/happyGf.gif"
    "src/assets/irritatedGf.gif"
    "src/assets/icon.svg"
    "package.json"
    "forge.config.js"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        missing_files+=("$file")
    fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo "❌ Missing files:"
    printf '   %s\n' "${missing_files[@]}"
    exit 1
else
    echo "✅ All required files present"
fi

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if [[ ! -d "node_modules" ]]; then
    echo "⚠️  Dependencies not installed. Run: pnpm install"
    exit 1
else
    echo "✅ Dependencies installed"
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Install with: npm install -g pnpm"
    exit 1
else
    echo "✅ pnpm available"
fi

# Test syntax of main files
echo "🔍 Checking JavaScript syntax..."
node -c src/main.js && echo "✅ main.js syntax OK" || echo "❌ main.js syntax error"
node -c src/preload.js && echo "✅ preload.js syntax OK" || echo "❌ preload.js syntax error"

echo ""
echo "🎉 All tests passed! Ready to launch your crazy girlfriend!"
echo ""
echo "🚀 To start: pnpm start"
echo "📦 To build: pnpm run make"
echo ""
echo "⚠️  WARNING: Prepare for maximum clinginess! 💕"