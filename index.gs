// script properties 

const scriptProperties = PropertiesService.getScriptProperties();

const targetBaseFolderId = scriptProperties.getProperty('drive-folder-id'); // Base Google Drive folder ID for the invoices
if(!targetBaseFolderId) {
  throw new Error("Cannot start synchronizing invoices without a driver folder id. Please set drive-folder-id in your Script Settings.");
}

const emailAddress = scriptProperties.getProperty("email")

// Optional, defaults to 'google.com-2024-01-ffffffff-ffff-ffff-ffffff.pdf'.
const folderPattern = scriptProperties.getProperty("folder-pattern") || "{senderDomain}-{year}-{month}-{uniqueId}.{filetype}";
// Optional, defaults to '2024/Q1' which will create both folders in your selected drive folder. 
const filePattern = scriptProperties.getProperty("file-pattern") || "{year}/Q{quarter}";

const baseFolder = DriveApp.getFolderById(targetBaseFolderId);
if(!baseFolder) {
  throw new Error(`Folder with id '${targetBaseFolderId}' was not found or is not accessible. Please make sure you have access to this folder.`)
}

// constants

const invoiceProcessedLabal = "Invoice Processed"

function processInvoices() {
   // Adjust search query as needed, feel like this is a decent default. If you need anything 
   // else you can simple edit this property.
  var threads = GmailApp.search("-{label:invoice-processed} has:attachment to:" + emailAddress);
  if(threads.length === 0) {
    Logger.log("No new emails to process!")
    return;
  }

  let userLabel = GmailApp.getUserLabelByName(invoiceProcessedLabal)
  if(!userLabel) {
    userLabel = GmailApp.createLabel(invoiceProcessedLabal);
  }

  for (const thread of threads) {
    var messages = thread.getMessages();
    for (const message of messages) { 
      const date = message.getDate();
      const email = getEmailSegments(message.getFrom())
      const messageProps = {
        year: date.getFullYear(),
        quarter: Math.ceil((date.getMonth() + 1) / 3),
        month: date.getMonth() + 1,
        uniqueId: Utilities.getUuid(),
        sender: email.user + "@" + email.domain,
        senderDomain: getPureDomain(email.domain),
      }

      const folderPath = createFromPattern(folderPattern, messageProps)
      let targetFolder = baseFolder;
      let folderPathSegments = folderPath.split('/');
      for (const segment of folderPathSegments) {
        targetFolder = getOrCreateFolder(targetFolder, segment);
      }

      Logger.log(`Setting folder from path '${folderPath}' to ${targetFolder.getName()}`)

      var attachments = message.getAttachments();
      for (const attachment of attachments) {
        const attachmentFullName = attachment.getName().split('.');
        const attachmentName = attachmentFullName.slice(0, -1);
        const attachmentExtension = attachmentFullName.slice(-1);

        const fileName = createFromPattern(filePattern, {
          ...messageProps,
          fileName: attachmentName,
          fileType: attachmentExtension,
        })

        attachment.setName(fileName);        
        Logger.log(`Saved '${attachment.getName()}' as '${folderPath}/${fileName}'`)

        targetFolder.createFile(attachment)
      }

      Logger.log(`Message '${message.getSubject()}' processed successfully!`)
    }
    
    thread.markRead();
    thread.addLabel(userLabel);
  }

  Logger.log(`Successfully handled all invoices!`)
}

// --- Utilities below

/**
 * Creates a usable string from a pattern. Patterns are created as a static string with handlebars-like 
 * interpolation. e.g. 'hello {who}'. If the properties contains { who: "world" }, this will translate
 * to 'hello world'.
 * 
 * @param {string} pattern
 * @param {Record<string, string>} properties
 */
function createFromPattern(pattern, properties) {
  return pattern.replace(/{(.*?)}/g, (_, code) => {
    return properties[code]
  });
} 

/**
 * Gets a drive child folder in current folder by name. 
 * 
 * @param {DriveApp.Folder} parent
 * @param {string} folderName
 */
function getOrCreateFolder(parent, folderName) {
  var folders = parent.getFoldersByName(folderName);
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = parent.createFolder(folderName);
  }
  
  return folder;
}

/**
 * Splits the email into two segments. e.g. 'hello@veld.gg' becomes { user: "hello", domain: "veld.gg" }.
 * 
 * @param {string} email
 */
function getEmailSegments(email) {
  // If the email is direct without a display name, we do not need to handle the formatting regex and 
  // we can simply check the email directly.
  if(!email.includes(">")) {
    const directMatches = email.match(/(.+)\@(.+\..+)/);
    return {
      user: directMatches[1],
      domain: directMatches[2],
    }
  }

  const matches = email.match(/.*\<(.+)\@(.+\..+)\>/);
  if(!matches) {
    throw new Error(`Cannot process email address '${email}' as it was not a correct address.`)
  }

  return {
    user: matches[1],
    domain: matches[2],
  }
}

/**
 * Gets the second last part from a domain. e.g. for 'marketing.google.com', it will try to find 'google' to simplify domain names. 
 * 
 * @param {string} domain
 */
function getPureDomain(domain) {
  var parts = domain.split(".").filter(Boolean);
  if(parts.length < 2) {
    return domain;
  }

  return parts[parts.length - 2];
}
