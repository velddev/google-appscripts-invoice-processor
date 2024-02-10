# Google AppScripts Invoice Processor

Automate your invoice email address pull invoices from an email address and save them to a Google Drive folder.

## Getting Started

It's super easy! Copy the [script](https://github.com/velddev/google-appscripts-invoice-processor/blob/main/index.gs) in your new appscripts project and get to configuring! 

### Configuration Properties

name  | required? | description | remarks
----- | --------- | ----------- | -------
drive-folder-id | yes |The ID of the Drive folder. You can find the ID in your address bar. For example for 'https://drive.google.com/drive/folders/1RBI0koQItEo8u5wlN5Z-csHZlnjsTrls'; '1RBI0koQItEo8u5wlN5Z-csHZlnjsTrls' is the ID. | Make sure your current user account has access to write to the folder.
email | yes | Your preferred email address. This email address will be used to pull emails and process the attachments. Make sure this is consistent across your inbox. | 
file-pattern | no | This is the pattern in which the file will be saved. See [File Pattern Variables](#file-pattern-variables) for all possible variables. |
folder-pattern | no | This pattern determines what subfolder your file will be saved in. These subfolders will be created beforehand, even if there is no attachment to process. |

## Patterns

Patterns are used to customize your setup. They work very similar to string interpolation. Simply encase your variable with '{' and '}' to make it work. an example would be {year}.{fileType} would translate to something like '2024.pdf'.

### Folder Pattern Variables

name  | description
----- | -----------
month | The current incoming email's month.
quarter | The quarter in which the incoming email's month is in.
sender | The full email address of the sender (FROM).
senderDomain | The pure domain of the sender (FROM). This is to simplify the domain down to the root domain. e.g. 'notify.cloudflare.com' becomes 'cloudflare'.
uniqueId | A unique UUID, not guaranteed to be unique, but [VERY improbable](https://jhall.io/archive/2021/05/19/what-are-the-odds/).
year | The current incoming email's year.

### File Pattern Variables

name  | description
----- | -----------
fileName | The file's current name.
fileType | The file's extension.
month | The current incoming email's month.
quarter | The quarter in which the incoming email's month is in.
sender | The full email address of the sender (FROM).
senderDomain | The pure domain of the sender (FROM). This is to simplify the domain down to the root domain. e.g. 'notify.cloudflare.com' becomes 'cloudflare'.
uniqueId | A unique UUID, not guaranteed to be unique, but [VERY improbable](https://jhall.io/archive/2021/05/19/what-are-the-odds/).
year | The current incoming email's year.
