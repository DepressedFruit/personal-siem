# Personal SIEM
A project for a personal and simple to configure SIEM.
Written in **Typescript**, the program consists of 3 core components: **Watchers**, **Rules & Decoders** and **Actions** (Integrations).

Table of Contents
 - [Setup](#setup)
 - [Features](#features)
 - [Components](#components)
 - [Extending](#extending)
	 - [Rules & Decoders](#rules--decoders-1)
	 - [Custom Watchers](#custom-watchers)
	 - [Custom Actions](#custom-actions)
 - [Maintainers](#maintainers)

# Setup
To install Personal SIEM, you can run the install script using cURL or Wget.
```
curl -o- https://raw.githubusercontent.com/DepressedFruit/personal-siem/release/setup.sh | bash
```
```
wget -qO- https://raw.githubusercontent.com/DepressedFruit/personal-siem/release/setup.sh | bash
```

# Features
 - Agent Mode
 - Rules & Decoders
 - Custom Watchers
 	 - Log File Watcher
 - Custom Actions (Integrations)
 	 - [Email](https://github.com/DepressedFruit/personal-siem/tree/main/src/actions/email)
	 - [Slack (via Webhooks)](https://github.com/DepressedFruit/personal-siem/tree/main/src/actions/slack)
	 - [ntfy](https://github.com/DepressedFruit/personal-siem/tree/main/src/actions/ntfy)
### Future Features
- Pooling Mode
- Manager Mode

# Components
#### Watchers
Individual plugins that can be configured to watch log files, run checking commands at intervals and more.
Results from the watchers are then passed onto the Rules & Decoders components.

#### Rules & Decoders
After receiving logs from watchers, the component will decode and parse them to determine the threat level as well as picking out important keywords from the logs using Regex.

When the parsing is done, information from this component will then be passed to Actions.

#### Actions
Individual plugins that can determine what to do with the parsed logs. For example: uploading it to a database, sending an email and notifying slack.

#### Overall Process Flow
Watchers -> Parsing Rules & Decoders -> Actions

# Extending
## Rules & Decoders
Rules and Decoders are done on JSON format and can be located in `config/rules`.
An individual file is considered as a group.

Example:
```json
{
	"group": {
		"id": 6,
		"name": "Apache",
		"dateMatch": "^\\[(\\w+ \\w+ \\d+ \\d+:\\d+:\\d+.\\d+ \\d+)\\]"
	},
	"rules": [
		{
			"id": 601,
			"name": "Apache Client Alert",
			"description": "Apache: %type% for %source% on %message%",
			"level": 1,
			"decoder": {
				"regex": "\\[(\\S+)\\] \\[client (.*)\\] (.*)",
				"variables": "type,source,message"
			}
		}
	]
}
```
- `group.dateMatch` is optional and only used when the log has a different date format than the defaults like `Oct 20 17:56:52` or `10/12/2022 22:34:24`.
- `group.dateGroupId` is optional and only used when `group.dateMatch` regex has multiple groups to identify the main date string.

## Custom Watchers
Custom Watchers scripts has to be placed in the `src/watchers` folder. For example, for a plugin named `log-files`, the main file for the script will be in `src/watchers/log-files/index.ts`.

Starting boilerplate for the script:
```typescript
import { WatcherPluginProps } from '../../@types/watchers/watcher'
export default async function({
    logger,
    options,
    next,
}: WatcherPluginProps): Promise<void> {
    next({
	    watcher: 'watcher-name',
	    description: 'line of log to be sent to decoder.',
	    data: {}, // Data object of log to be passed to Actions.
	});
};
```
- `next` is used to send the line of log to the decoder.

Add the custom watcher script into the config JSON `configs/watchers.json`.
```json
{
	"name": "Name to identify log.",
	"enabled": true,
	"watcher": "folder of logger."
	"options": {}
}
```

## Custom Actions
Also called custom integrations, these are scripts that does whatever post processing needed with the decoded logs.

Custom Action scripts are placed in the `src/actions` folder. For example, for a plugin named `send-to-slack`, the main file for the script will be in `src/actions/send-to-slack/index.ts`.

Starting boilerplate for the script:
```typescript
import { ActionPluginProps } from '../../@types/lib/action';

export default async function({
    action,
    decoded
}: ActionPluginProps): Promise<void> {
	const { options } = action;
	// Notify slack etc.
}
```

Add the custom actions script into the config JSON `configs/actions.json`.
```json
{
	"name": "Name of action.",
	"action": "folder of action",
	"enabled": false,
	"level": 1,
	"options": {}
}
```
- `level` will only trigger the action when the decoder parses the appropriate level or above.

## Maintainers
More are welcome and I am happy to receive some help.

- [jtPox](https://github.com/jtpox)