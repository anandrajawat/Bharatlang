#!/usr/bin/env bash
# ==============================================================================
# BharatLangTech AI - Frontend Dev Server Runner
# Starts the Vite React development server.
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "$ROOT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "======================================================================"
echo "⚡ Starting BharatLangTech AI React Frontend on http://localhost:5173"
echo "======================================================================"

exec npm run dev -- --host

