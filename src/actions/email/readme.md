# Email Action
Sending a notification email after a log level specified has been parsed from the decoder.

Requires your SMTP host details.

# Usage
Add a new entry to `actions.json` in the configs.

```json
{
    "name": "Notify-Email",
    "action": "email",
    "enabled": true,
    "level": 8,
    "options": {
        "smtp": {
            "user": "SMTP username here.",
            "password": "SMTP password here.",
            "host": "SMTP host here.",
            "port": 587,
            "use_tls": true
        },
        "subject": "Subject of the email here.",
        "from": "Email sent from.",
        "to": "Email to be sent to."
    }
}
```

### level
set the minimum log level that you want to be notified from. Normally you'd only want to be notified from a higher level like 8 or above, depending on how you rate your rules.

### subject
The field has variables that could be added.

Available variables are:
- `%hostname%`
- `%rule_id%`
- `%rule_name%`
- `%rule_date%`
- `%rule_description%`
- `%rule_level%`

# Dependencies
- [nodemailer](https://www.npmjs.com/package/nodemailer)