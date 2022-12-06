#!/usr/bin/env bash
# Clone latest version of personal-siem
git clone -b release --single-branch https://github.com/DepressedFruit/personal-siem.git
cd personal-siem
SIEM_DIR=$(pwd)

# Install dependencies.
npm install --omit=dev

# Create reactions.log
mkdir logs
touch logs/reactions.log
echo "$(date +"%m/%d/%Y %T") [INFO] reactions.log created." >> logs/reactions.log

echo "Personal SIEM has been installed in $SIEM_DIR

Extend Personal SIEM with the files and directories below:
- Rules: $SIEM_DIR/configs/rules
- Watchers: $SIEM_DIR/configs/watchers.json
- Actions: $SIEM_DIR/configs/actions.json

Start Personal SIEM with PM2:
cd $SIEM_DIR
pm2 start siem

Or if you don't want to run quietly:
cd $SIEM_DIR
node siem"