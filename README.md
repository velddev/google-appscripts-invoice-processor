# Google AppScripts Invoice Processor

Streamline your invoicing process with our Google AppScripts Invoice Processor. This tool automatically retrieves invoices from a specified email address and stores them in a designated Google Drive folder.

## Quick Start

Get started in no time! Simply clone the [script](https://github.com/velddev/google-appscripts-invoice-processor/blob/main/index.gs) into your Google AppScripts project and proceed to setup.

### Setup Instructions

Configure the script using the following properties:

Property | Required | Description | Additional Info
--- | --- | --- | ---
`drive-folder-id` | Yes | The Google Drive folder ID where invoices will be saved. Find this ID in your browser's address bar. | Ensure you have write access to the folder.
`email` | Yes | The email address to monitor for incoming invoices. | Ensure consistency across your inbox.
`file-pattern` | No | Defines the naming convention for saved files. Refer to [File Pattern Variables](#file-pattern-variables) for options.
`folder-pattern` | No | Specifies the subfolder structure within the Drive folder. Subfolders are pre-created as needed.

## Customization with Patterns

Utilize patterns to tailor file and folder naming. Wrap variables in `{}` to integrate them into your naming scheme. For example, `{year}.{fileType}` could result in `2024.pdf`.

### Folder Pattern Variables

Variable | Description
--- | ---
`month` | Month of the received email.
`quarter` | Quarter of the received email's month.
`sender` | Sender's full email address.
`senderDomain` | Root domain of the sender's email address, e.g., 'cloudflare' from 'notify.cloudflare.com'.
`uniqueId` | A UUID for unique identification (though not [guaranteed to be globally unique](https://jhall.io/archive/2021/05/19/what-are-the-odds/)).
`year` | Year of the received email.

### File Pattern Variables

Variable | Description
--- | ---
`fileName` | Original name of the file.
`fileType` | File extension.
`month` | Month of the received email.
`quarter` | Quarter of the received email's month.
`sender` | Sender's full email address.
`senderDomain` | Root domain of the sender's email address.
`uniqueId` | A UUID for unique identification.
`year` | Year of the received email.
