#!/bin/bash

# Check if port 3001 is available
if ! ss -tlnp | grep -q 3001; then
  echo "Starting on port 3001"
  npm run dev -- --port 3001
else
  echo "Port 3001 in use, trying 3004"
  npm run dev -- --port 3004
fi