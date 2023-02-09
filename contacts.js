const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

// Returns array of objects from file
function listContacts() {
  const data = fs.readFileSync(contactsPath, "utf8");
  return JSON.parse(data);
}

//Get id of contact, returns object that contain contact
function getContactById(contactId) {
  const contacts = listContacts();
  const contactItem = contacts.find(
    ({ id }) => id.toString() === contactId.toString()
  );
  if (!contactItem) {
    throw new Error("Contact not found");
  }
  return contactItem;
}

//Get id of contact, delete contact from file, returns object that contain deleted contact
function removeContact(contactId) {
  const contacts = listContacts();
  const index = contacts.findIndex(
    ({ id }) => id.toString() === contactId.toString()
  );
  if (index === -1) {
    throw new Error("There are no such contact");
  }
  const removedContact = contacts.splice(index, 1);
  const strContacts = JSON.stringify(contacts, undefined, " ");
  fs.writeFileSync(contactsPath, strContacts, "utf8");
  return removedContact;
}

// Get name, mail, phone of contact, create object of new contact, rewrite file with refreshed contacts, returns object of created contact
function addContact(name, email, phone) {
  const contacts = listContacts();
  const id = uuidv4();
  const newContact = { id, name, email, phone };
  const isExist = contacts.some((e) => e.id.toString() === id.toString());
  if (isExist) {
    throw new Error(`Contact with id: ${id} already exist`);
  }
  const newContacts = JSON.stringify([...contacts, newContact], undefined, " ");
  fs.writeFileSync(contactsPath, newContacts, "utf8");
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
