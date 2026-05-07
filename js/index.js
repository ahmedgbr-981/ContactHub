var addContactBtn = document.getElementById("addContact");
var addNewContact = document.getElementById("addNewContact");
var xmark = document.getElementById("xmark");
var contactsContainer = document.getElementById("contactsContainer");
var fname = document.getElementById("fname");
var PhoneNumber = document.getElementById("PhoneNumber");
var EmailAddress = document.getElementById("EmailAddress");
var Address = document.getElementById("Address");
var group = document.getElementById("group");
var notes = document.getElementById("notes");
var favCheck = document.getElementById("favCheck");
var emargCheck = document.getElementById("emargCheck");
var save = document.getElementById("save");
var updatebtn = document.getElementById("update");
var total = document.getElementById("total");

var currIndex = 0;
var contacts = [];

if (localStorage.getItem("contacts") !== null) {
  contacts = JSON.parse(localStorage.getItem("contacts"));
  display();
}

function showAddContact(element) {
  if (element.id == "addContact") {
    addNewContact.classList.remove("d-none");
  } else {
    addNewContact.classList.add("d-none");
  }
}

function validation(ele, alertId) {
  // console.log(ele.id);
  // console.log(alertId);
  alertId = document.getElementById(alertId);

  let regex = {
    fname: /^[A-Za-z]+(?:\s[A-Za-z]+)+$/,
    PhoneNumber: /^(010|011|012|015)[0-9]{8}$/,
    EmailAddress: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };
  let text = ele.value;

  if (regex[ele.id].test(text)) {
    alertId.classList.add("d-none");
    return true;
  } else {
    alertId.classList.remove("d-none");
    return false;
  }
}

function addContact() {
  
  if (validation(fname, "fnameAlert") && validation(PhoneNumber, "phoneAlert") && validation(EmailAddress, "emailAlert")) {
    var contact = {
      fullName: fname.value,
      phoneNum: PhoneNumber.value,
      email: EmailAddress.value,
      address: Address.value,
      group: group.value ? group.value : "other",
      notes: notes.value,
      fav: "checked",
      emarg: "not checked",
    };
    contacts.push(contact);
    console.log(contacts);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    total.innerHTML = contacts.length;
    showAddContact(save.id)
    display();
    Swal.fire({
      title: "contact added ✔✌",
      icon: "success",
      draggable: true,
    });
  } else {
    Swal.fire({
      title: "Failed to add",
      icon: "error",
      draggable: true,
    });
  }
}

function display() {
  var box = "";

  for (var i = 0; i < contacts.length; i++) {
    box += ` <div class="col-md-6" >
     <div class="card mb-3 p-2 rounded-3">
                                        <div class="item d-flex">
                                            <div class="contact-img"></div>
                                            <div class="info ps-2">
                                                <span>${contacts[i].fullName}</span><br> <br>
                                                <span
                                                    style="background-color: #DBEAFE; padding: 5px;border-radius: 10px;"><i
                                                        class="fa-solid fa-phone" style="color: blue;"></i></span>
                                                <span style="color: #6a7282;">${contacts[i].phoneNum}</span>
                                            </div>
                                        </div><br>
                                        <p><i class="fa-solid fa-envelope" style="color: rgb(177, 151, 252);"></i>
                                            ${contacts[i].email}</p>
                                        <p><i class="fa-solid fa-location-dot" style="color: rgb(99, 230, 190);"></i>
                                            ${contacts[i].address}</p>
                                        <span
                                            style="background-color: #F3E8FF; color: #8200DB;width: fit-content;padding: 5px; border-radius: 10px;">${contacts[i].group}</span>
                                        <div class="mt-3 d-flex justify-content-between info-footer">
                                            <div><i class="fa-solid fa-phone me-2"></i>
                                                <i class="fa-solid fa-envelope"></i>
                                            </div>

                                            <div style="color: #6a7282;">
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-solid fa-heart-pulse"></i>
                                                <i class="fa-solid fa-pencil" onclick="edit(${i})"></i>
                                                <i class="fa-solid fa-trash" onclick="deleteContact(${i})"></i>
                                            </div>
                                        </div>
                                    </div>
                                     </div>`;
  }

  contactsContainer.innerHTML = box;

  clear();
}

function clear() {
  fname.value = null;
  EmailAddress.value = null;
  Address.value = null;
  group.value = null;
  PhoneNumber.value = null;
  notes.value = null;
}

function deleteContact(index) {
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  display();
  console.log("ok");
  total.innerHTML = contacts.length;
}

function edit(index) {
  currIndex = index;
  addNewContact.classList.remove("d-none");
  save.classList.add("d-none");
  updatebtn.classList.remove("d-none");
  fname.value = contacts[index].fullName;
  PhoneNumber.value = contacts[index].phoneNum;
  Address.value = contacts[index].address;
  EmailAddress.value = contacts[index].email;
  group.value = contacts[index].group;
  notes.value = contacts[index].notes;
}

function updateContact() {
  var contact = {
    fullName: fname.value,
    phoneNum: PhoneNumber.value,
    email: EmailAddress.value,
    address: Address.value,
    group: group.value ? group.value : "other",
    notes: notes.value,
    fav: "checked",
    emarg: "not checked",
  };

  contacts.splice(currIndex, 1, contact);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  addNewContact.classList.add("d-none");
  save.classList.remove("d-none");
  updatebtn.classList.add("d-none");
  display();
  total.innerHTML = contacts.length;
}

total.innerHTML = contacts.length;
