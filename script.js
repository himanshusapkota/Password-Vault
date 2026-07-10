let list = [];

const form = document.getElementById("form");

const site = document.getElementById("site");

const user = document.getElementById("user");

const pass = document.getElementById("pass");

const editId = document.getElementById("editId");

const submitBtn = document.getElementById("submitBtn");

const showBtn = document.getElementById("showBtn");

const genBtn = document.getElementById("genBtn");

const fill = document.getElementById("fill");
const label = document.getElementById("label");


const search = document.getElementById("search");

const listBox = document.getElementById("list");

const empty = document.getElementById("empty");

const darkBtn = document.getElementById("darkBtn");

function load() {
  const saved = localStorage.getItem("list");
  if (saved) {
    list = JSON.parse(saved);
  }
}

function save() {
  localStorage.setItem("list", JSON.stringify(list));
}

function findItem(id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i];
    }
  }
  return null;
}

function findIndex(id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i;
    }
  }
  return -1;
}

function render(items) {
  if (items.length === 0) {
    listBox.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  let html = "";

  for (let i = 0; i < items.length; i++) {
    const data = items[i];

    html += "<div class='item'>";
     html += "<div class='name'>" + data.site + "</div>";
      html += "<div class='user'>" + data.user + "</div>";
       html += "<div class='show'>";
        html += "<span class='pass' id='pass-" + data.id + "'>••••••••</span>";
         html += "</div>";
          html += "<div class='buttons'>";
           html += "<button class='view' onclick='viewPassword(\"" + data.id + "\")'>Show</button>";
            html += "<button class='copy' onclick='copyPassword(\"" + data.id + "\")'>Copy</button>";
             html += "<button class='edit' onclick='editPassword(\"" + data.id + "\")'>Edit</button>";
              html += "<button class='del' onclick='deletePassword(\"" + data.id + "\")'>Delete</button>";
               html += "</div>";
                html += "</div>";
  }

  listBox.innerHTML = html;
}

function viewPassword(id) {
  const data = findItem(id);
  if (!data) return;

  const textEl = document.getElementById("pass-" + id);
  const isHidden = textEl.textContent === "••••••••";

  if (isHidden) {
    textEl.textContent = data.pass;
  } else {
    textEl.textContent = "••••••••";
  }
}

function copyPassword(id) {
  const data = findItem(id);
  if (!data) return;

  navigator.clipboard.writeText(data.pass);
  alert("Password copied to clipboard!");
}

function deletePassword(id) {
  const sure = confirm("Are you sure you want to delete this password?");
  if (!sure) return;

  const index = findIndex(id);
  if (index !== -1) {
    list.splice(index, 1);
  }

  save();
  render(list);
}

function editPassword(id) {
  const data = findItem(id);
  if (!data) return;

  site.value = data.site;
  user.value = data.user;
  pass.value = data.pass;
  editId.value = data.id;
  submitBtn.textContent = "Update Password";

  checkStrength(data.pass);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeId() {
  return Date.now().toString();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const siteVal = site.value.trim();
  const userVal = user.value.trim();
  const passVal = pass.value;
  const id = editId.value;

  if (siteVal === "" || userVal === "" || passVal === "") {
    return;
  }

  if (id) {
    const data = findItem(id);
    if (data) {
      data.site = siteVal;
      data.user = userVal;
      data.pass = passVal;
    }
    submitBtn.textContent = "Add Password";
    editId.value = "";
  } else {
    const newItem = {
      id: makeId(),
      site: siteVal,
      user: userVal,
      pass: passVal
    };
    list.push(newItem);
  }

  save();
  render(list);
  form.reset();
  fill.style.width = "0%";
  label.textContent = "-";
  pass.type = "password";
  showBtn.textContent = "Show";
});

showBtn.addEventListener("click", function () {
  if (pass.type === "password") {
    pass.type = "text";
    showBtn.textContent = "Hide";
  } else {
    pass.type = "password";
    showBtn.textContent = "Show";
  }
});

function genPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let result = "";

  for (let i = 0; i < 12; i++) {
    const index = Math.floor(Math.random() * chars.length);
    result += chars[index];
  }

  return result;
}

genBtn.addEventListener("click", function () {
  const newPass = genPassword();
  pass.value = newPass;
  pass.type = "text";
  showBtn.textContent = "Hide";
  checkStrength(newPass);
});

function checkStrength(value) {
  let score = 0;

  if (value.length >= 8) score = score + 1;
  if (value.length >= 12) score = score + 1;
  if (/[A-Z]/.test(value)) score = score + 1;
  if (/[0-9]/.test(value)) score = score + 1;
  if (/[^A-Za-z0-9]/.test(value)) score = score + 1;

  let percent = 0;
  let text = "";
  let color = "";

  if (score <= 1) {
    percent = 20;
    text = "Very Weak";
    color = "red";
  }  
  else if (score === 2) {
    percent = 40;
    text = "Weak";
    color = "orange";
  } 
  
  else if (score === 3) {
    percent = 60;
    text = "Medium";
    color = "gold";
  } 
  
  else if (score === 4) {
    percent = 80;
    text = "Strong";
    color = "yellowgreen";
  } 
  
  else {
    percent = 100;
    text = "Very Strong";
    color = "green";
  }

  fill.style.width = percent + "%";
  fill.style.backgroundColor = color;
  label.textContent = text;
}

pass.addEventListener("input", function () {
  checkStrength(pass.value);
});

search.addEventListener("input", function () {
  const query = search.value.toLowerCase();
  const matches = [];

  for (let i = 0; i < list.length; i++) {
    const data = list[i];
    const siteMatch = data.site.toLowerCase().includes(query);
    const userMatch = data.user.toLowerCase().includes(query);

    if (siteMatch || userMatch) {
      matches.push(data);
    }
  }

  render(matches);
});

darkBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("dark", isDark ? "true" : "false");

  if (isDark) {
    darkBtn.textContent = "☀️ Light Mode";
  } else {
    darkBtn.textContent = "🌙 Dark Mode";
  }
});

function loadDark() {
  const saved = localStorage.getItem("dark");
  if (saved === "true") {
    document.body.classList.add("dark");
    darkBtn.textContent = "☀️ Light Mode";
  }
}

load();
loadDark();
render(list);