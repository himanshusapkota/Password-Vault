let passwords = [];




const form = document.getElementById("form");

const site = document.getElementById("site");
const user = document.getElementById("user");
const pass = document.getElementById("pass");

const showBtn = document.getElementById("showBtn");
const genBtn = document.getElementById("genBtn");

const submitBtn = document.getElementById("submitBtn");

const fill = document.getElementById("fill");
const label = document.getElementById("label");

const search = document.getElementById("search");

const list = document.getElementById("list");
const empty = document.getElementById("empty");

const editId = document.getElementById("editId");



function loadPasswords() {

    const saved = localStorage.getItem("passwords");

    if (saved) {
        passwords = JSON.parse(saved);
    }

    showPasswords(passwords);
}




function savePasswords() {

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );
}




function showPasswords(items) {

    list.innerHTML = "";

    if (items.length === 0) {

        empty.style.display = "block";

        return;
    }

    empty.style.display = "none";


    items.forEach(function (item) {

        const div = document.createElement("div");

        div.className = "item";


        div.innerHTML = `

            <h3>${item.site}</h3>

            <p>${item.user}</p>

            <div class="saved-password">

                <span id="password-${item.id}">
                    ********
                </span>

            </div>

            <div class="item-buttons">

                <button onclick="showPassword('${item.id}')">
                    Show
                </button>

                <button onclick="copyPassword('${item.id}')">
                    Copy
                </button>

                <button onclick="editPassword('${item.id}')">
                    Edit
                </button>

                <button onclick="deletePassword('${item.id}')">
                    Delete
                </button>

            </div>
        `;


        list.appendChild(div);

    });
}




function showPassword(id) {

    const item = passwords.find(function (item) {
        return item.id === id;
    });

    if (!item) return;


    const element =
        document.getElementById("password-" + id);


    if (element.textContent === "********") {

        element.textContent = item.pass;

    } else {

        element.textContent = "********";
    }
}



function copyPassword(id) {

    const item = passwords.find(function (item) {
        return item.id === id;
    });

    if (!item) return;


    navigator.clipboard.writeText(item.pass);

    alert("Password copied.");
}



function deletePassword(id) {

    const confirmDelete =
        confirm("Delete this password?");

    if (!confirmDelete) return;


    passwords = passwords.filter(function (item) {
        return item.id !== id;
    });


    savePasswords();

    showPasswords(passwords);
}




function editPassword(id) {

    const item = passwords.find(function (item) {
        return item.id === id;
    });

    if (!item) return;


    site.value = item.site;
    user.value = item.user;
    pass.value = item.pass;

    editId.value = id;

    submitBtn.textContent = "Update Password";

    checkStrength(item.pass);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



function generatePassword() {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789" +
        "!@#$%^&*";


    let password = "";


    for (let i = 0; i < 12; i++) {

        const random =
            Math.floor(
                Math.random() * characters.length
            );

        password += characters[random];
    }


    return password;
}




genBtn.addEventListener("click", function () {

    const password = generatePassword();

    pass.value = password;

    pass.type = "text";

    showBtn.textContent = "Hide";

    checkStrength(password);
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



function checkStrength(password) {

    let score = 0;


    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (score <= 1) {

        fill.style.width = "20%";
        fill.style.background = "#ff3333";

        label.textContent = "Very Weak";

    }

    else if (score === 2) {

        fill.style.width = "40%";
        fill.style.background = "#ff8800";

        label.textContent = "Weak";

    }

    else if (score === 3) {

        fill.style.width = "60%";
        fill.style.background = "#ffff00";

        label.textContent = "Medium";

    }

    else if (score === 4) {

        fill.style.width = "80%";
        fill.style.background = "#88cc44";

        label.textContent = "Strong";

    }

    else {

        fill.style.width = "100%";
        fill.style.background = "#22cc55";

        label.textContent = "Very Strong";
    }
}




pass.addEventListener("input", function () {

    checkStrength(pass.value);

});




form.addEventListener("submit", function (event) {

    event.preventDefault();


    const siteName = site.value.trim();

    const username = user.value.trim();

    const password = pass.value;


    if (
        siteName === "" ||
        username === "" ||
        password === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    const editingId = editId.value;


 

    if (editingId) {

        const item = passwords.find(function (item) {
            return item.id === editingId;
        });


        if (item) {

            item.site = siteName;
            item.user = username;
            item.pass = password;
        }


        submitBtn.textContent = "Add Password";

        editId.value = "";

    }


    else {

        const newPassword = {

            id: Date.now().toString(),

            site: siteName,

            user: username,

            pass: password
        };


        passwords.push(newPassword);
    }


    savePasswords();

    showPasswords(passwords);


    form.reset();

    fill.style.width = "0%";

    label.textContent = "-";

    pass.type = "password";

    showBtn.textContent = "Show";
});



search.addEventListener("input", function () {

    const query =
        search.value.toLowerCase();


    const results = passwords.filter(function (item) {

        return (
            item.site.toLowerCase().includes(query) ||
            item.user.toLowerCase().includes(query)
        );

    });


    showPasswords(results);
});




loadPasswords();