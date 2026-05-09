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
var favCounter = document.getElementById("favCounter");
var Fav = document.getElementById("fav");
var Emergency = document.getElementById("emarg");
var emargCounter = document.getElementById("emargCounter");
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
    clear();
    addNewContact.classList.add("d-none");
  }
}

function closeForm(event) {
  if (event.target.id === "addNewContact") {
    addNewContact.classList.add("d-none");
    clear();
  }
}

function validation(ele, alertId) {
  alertId = document.getElementById(alertId);

  let regex = {
    fname: /^[A-Za-z]+(?:\s[A-Za-z]+)+$/,
    PhoneNumber: /^(010|011|012|015)[0-9]{8}$/,
    EmailAddress: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  let text = ele.value.trim();

  if (!regex[ele.id].test(text)) {
    alertId.classList.remove("d-none");
    return false;
  }

  if (ele.id === "PhoneNumber") {
    let duplicate = false;

    if (updatebtn.classList.contains("d-none")) {
      // add mode
      duplicate = contacts.some(function (contact) {
        return contact.phoneNum === text;
      });
    } else {
      // update mode
      duplicate = contacts.some(function (contact, index) {
        return contact.phoneNum === text && index !== currIndex;
      });
    }

    if (duplicate) {
      alertId.classList.remove("d-none");
      alertId.innerHTML = "Phone number already exists";
      return false;
    }
  }

  alertId.classList.add("d-none");
  return true;
}

function addContact() {
  if (
    validation(fname, "fnameAlert") &&
    validation(PhoneNumber, "phoneAlert") &&
    validation(EmailAddress, "emailAlert")
  ) {
    var contact = {
      fullName: fname.value,
      phoneNum: PhoneNumber.value,
      email: EmailAddress.value,
      address: Address.value,
      group: group.value ? group.value : "other",
      notes: notes.value,
      fav: false,
      emarg: false,
      fav: favCheck.checked,
      emarg: emargCheck.checked,
      img: photoInput.files[0]
        ? URL.createObjectURL(photoInput.files[0])
        : "default.jpg",
    };
    
    contacts.push(contact);
    if (contact.fav) {
      favs.push({
        name: contact.fullName,
        number: contact.phoneNum,
      });

      localStorage.setItem("favs", JSON.stringify(favs));
    }

    if (contact.emarg) {
      emargs.push({
        name: contact.fullName,
        number: contact.phoneNum,
      });

      localStorage.setItem("emargs", JSON.stringify(emargs));
    }
    console.log(contacts);
    localStorage.setItem("contacts", JSON.stringify(contacts));

    showAddContact(save.id);
    display();
    displayFav();
    displayEmarg();
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

function display(list = contacts) {
  total.innerHTML = list.length;
  var box = "";
  for (var i = 0; i < list.length; i++) {
    box += ` <div class="col-md-6" >
     <div class="card mb-3 p-2 rounded-3">
                                        <div class="item d-flex">
                                            <div class="contact-img position-relative" style="background: url(${list[i].img}) center / cover no-repeat;">
  ${list[i].fav ? `<span class="badge-fav">⭐</span>` : ""}
  ${list[i].emarg ? `<span class="badge-emarg">🚑</span>` : ""}
</div>
                                            <div class="info ps-2">
                                                <span>${list[i].fullName}</span><br> <br>
                                                <span
                                                    style="background-color: #DBEAFE; padding: 5px;border-radius: 10px;"><i
                                                        class="fa-solid fa-phone" style="color: blue;"></i></span>
                                                <span style="color: #6a7282;">${list[i].phoneNum}</span>
                                            </div>
                                        </div><br>
                                        <p><i class="fa-solid fa-envelope" style="color: rgb(177, 151, 252);"></i>
                                            ${list[i].email}</p>
                                        <p><i class="fa-solid fa-location-dot" style="color: rgb(99, 230, 190);"></i>
                                            ${list[i].address}</p>
                                        <span
                                            style="background-color: #F3E8FF; color: #8200DB;width: fit-content;padding: 5px; border-radius: 10px;">${list[i].group}</span>
                                        <div class="mt-3 d-flex justify-content-between info-footer">
                                            <div><i class="fa-solid fa-phone me-2" onclick="callContact(${i})"></i>
                                                <i class="fa-solid fa-envelope" onclick="sendEmail(${i})"></i>
                                            </div>

                                            <div style="color: #6a7282;">
                                              ${
                                                list[i].fav
                                                  ? `<i class="fa-solid fa-star" style="color:yellow" onclick="removeFav(${i})"></i>`
                                                  : `<i class="fa-regular fa-star" onclick="addToFav(${i})"></i>`
                                              }
                                               ${
                                                 list[i].emarg
                                                   ? `<i class="fa-solid fa-heart-pulse" style="color:red" onclick="removeEmarg(${i})"></i>`
                                                   : `<i class="fa-regular fa-heart" onclick="addToEmarg(${i})"></i>`
                                               }
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
  removeFav(index);
  removeEmarg(index);
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  display();
  console.log("ok");
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

  favCheck.checked = contacts[index].fav;
  emargCheck.checked = contacts[index].emarg;
}

function updateContact() {
  if (
    validation(fname, "fnameAlert") &&
    validation(PhoneNumber, "phoneAlert") &&
    validation(EmailAddress, "emailAlert")
  ) {
    var oldPhone = contacts[currIndex].phoneNum;

    var contact = {
      fullName: fname.value,
      phoneNum: PhoneNumber.value,
      email: EmailAddress.value,
      address: Address.value,
      group: group.value ? group.value : "other",
      notes: notes.value,
      fav: favCheck.checked,
      emarg: emargCheck.checked,
      img: photoInput.files[0]
        ? URL.createObjectURL(photoInput.files[0])
        : contacts[currIndex].img,
    };

    // update contact
    contacts.splice(currIndex, 1, contact);

    // remove old fav
    favs = favs.filter(function (fav) {
      return fav.number !== oldPhone;
    });

    // add updated fav
    if (contact.fav) {
      favs.push({
        name: contact.fullName,
        number: contact.phoneNum,
      });
    }

    // remove old emergency
    emargs = emargs.filter(function (emarg) {
      return emarg.number !== oldPhone;
    });

    // add updated emergency
    if (contact.emarg) {
      emargs.push({
        name: contact.fullName,
        number: contact.phoneNum,
      });
    }

    localStorage.setItem("contacts", JSON.stringify(contacts));
    localStorage.setItem("favs", JSON.stringify(favs));
    localStorage.setItem("emargs", JSON.stringify(emargs));

    addNewContact.classList.add("d-none");
    save.classList.remove("d-none");
    updatebtn.classList.add("d-none");

    display();
    displayFav();
    displayEmarg();
    Swal.fire({
      title: "contact updated ✔",
      icon: "success",
      draggable: true,
    });
  } else {
    Swal.fire({
      title: "Failed to update",
      icon: "error",
      draggable: true,
    });
  }
}

var favs = [];
// localStorage.removeItem("favs")
// localStorage.removeItem("emargs")
if (localStorage.getItem("favs") !== null) {
  favs = JSON.parse(localStorage.getItem("favs"));
  displayFav();
}

function addToFav(index) {
  contacts[index].fav = true;

  localStorage.setItem("contacts", JSON.stringify(contacts));

  var fav = {
    name: contacts[index].fullName,
    number: contacts[index].phoneNum,
    img: contacts[index].img,
  };

  favs.push(fav);
  localStorage.setItem("favs", JSON.stringify(favs));

  display();
  displayFav();
}

function removeFav(index) {
  contacts[index].fav = false;

  localStorage.setItem("contacts", JSON.stringify(contacts));

  favs = favs.filter(function (fav) {
    return fav.number !== contacts[index].phoneNum;
  });

  localStorage.setItem("favs", JSON.stringify(favs));

  display();
  displayFav();
}

function displayFav() {
  favCounter.innerHTML = favs.length;
  var box = "";

  for (var i = 0; i < favs.length; i++) {
    box += `
      <div class="favs d-flex align-items-center justify-content-center py-3">
        <div class="item d-flex w-100">
          <div class="contact-img" style="background: url(${favs[i].img}) center/cover no-repeat;"></div>
          <div class="info ps-2 w-75 d-flex justify-content-between align-items-center">
            <div>
              <span>${favs[i].name}</span><br>
              <span style="color: #6a7282;">${favs[i].number}</span>
            </div>
            <span class="favs-item" style="padding: 5px;border-radius: 10px;">
              <i class="fa-solid fa-phone" style="color: blue;"></i>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  Fav.innerHTML = box;
}

var emargs = [];

if (localStorage.getItem("emargs") !== null) {
  emargs = JSON.parse(localStorage.getItem("emargs"));
  displayEmarg();
}

function addToEmarg(index) {
  contacts[index].emarg = true;

  localStorage.setItem("contacts", JSON.stringify(contacts));

  var emarg = {
    name: contacts[index].fullName,
    number: contacts[index].phoneNum,
    img: contacts[index].img,
  };

  emargs.push(emarg);

  localStorage.setItem("emargs", JSON.stringify(emargs));

  display();
  displayEmarg();
}

function removeEmarg(index) {
  contacts[index].emarg = false;

  localStorage.setItem("contacts", JSON.stringify(contacts));

  emargs = emargs.filter(function (emarg) {
    return emarg.number !== contacts[index].phoneNum;
  });

  localStorage.setItem("emargs", JSON.stringify(emargs));

  display();
  displayEmarg();
}

function displayEmarg() {
  emargCounter.innerHTML = emargs.length;
  var box = "";

  for (var i = 0; i < emargs.length; i++) {
    box += `
      <div class="favs d-flex align-items-center justify-content-center py-3">
        <div class="item d-flex w-100">
          <div class="contact-img" style="background: url(${emargs[i].img}) center/cover no-repeat;"></div>
          <div class="info ps-2 w-75 d-flex justify-content-between align-items-center">
            <div>
              <span>${emargs[i].name}</span><br>
              <span style="color: #6a7282;">${emargs[i].number}</span>
            </div>
            <span class="favs-item" style="padding: 5px;border-radius: 10px;">
              <i class="fa-solid fa-phone" style="color: blue;"></i>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  Emergency.innerHTML = box;
}

function searchContacts() {
  console.log("ok");
  if (keyword === "") {
    display();
    return;
  }
  var keyword = document.getElementById("search").value.toLowerCase().trim();

  var filtered = contacts.filter(function (contact) {
    return (
      contact.fullName.toLowerCase().includes(keyword) ||
      contact.phoneNum.toLowerCase().includes(keyword) ||
      contact.email.toLowerCase().includes(keyword)
    );
  });

  display(filtered);
}

function callContact(index) {
  window.open(`tel:${contacts[index].phoneNum}`);
}

function sendEmail(index) {
  window.open(`mailto:${contacts[index].email}`);
}

console.log(contacts);
