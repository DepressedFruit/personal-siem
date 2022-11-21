# ntfy Action
Sending a push notification after a log level specified has been parsed from the decoder.

This action uses the [ntfy](https://ntfy.sh/) service.

# Usage
Add a new entry to `actions.json` in the configs.

```json
{
    "name": "Send-ntfy",
    "action": "email",
    "enabled": true,
    "level": 8,
    "options": {
        "url": "URL of the service here.",
        "topic": "Topic which you want to send the notification to.",
        "auth": {
            "user": "User that has permission to send a notification.",
            "password": "Password of that user."
        }
    }
}
```

### level
set the minimum log level that you want to be notified from. Normally you'd only want to be notified from a higher level like 8 or above, depending on how you rate your rules.