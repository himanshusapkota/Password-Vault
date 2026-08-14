let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

const form = document.getElementById("form");
const site = document.getElementById("site");
const user = document.getElementById("user");
const pass = document.getElementById("pass");
const list = document.getElementById("list");
const search = document.getElementById("search");
const fill = document.getElementById("fill");
const label = document.getElementById("label");

function save() {
    localStorage.setItem("passwords", JSON.stringify(passwords));
}

function display(items = passwords) {
    list.innerHTML = "";

    items.forEach(item => {
        list.innerHTML += `
            <div class="item">
                <h3>${item.site}</h3>
                <p>${item.user}</p>
                <span id="p${item.id}">********</span>
                <div class="item-buttons">
                    <button onclick="showPass('${item.id}')">Show</button>
                    <button onclick="copyPass('${item.id}')">Copy</button>
                    <button onclick="removePass('${item.id}')">Delete</button>
                </div>
            </div>`;
    });
}

function showPass(id) {
    const item = passwords.find(x => x.id == id);
    const el = document.getElementById("p" + id);
    el.textContent = el.textContent == "********" ? item.pass : "********";
}

function copyPass(id) {
    const item = passwords.find(x => x.id == id);
    navigator.clipboard.writeText(item.pass);
    alert("Password copied!");
}

function removePass(id) {
    if (confirm("Delete this password?")) {
        passwords = passwords.filter(x => x.id != id);
        save();
        display();
    }
}

document.getElementById("genBtn").onclick = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    pass.value = "";

    for (let i = 0; i < 12; i++) {
        pass.value += chars[Math.floor(Math.random() * chars.length)];
    }

    pass.type = "text";
    checkStrength(pass.value);
};

document.getElementById("showBtn").onclick = () => {
    pass.type = pass.type == "password" ? "text" : "password";
};

function checkStrength(p) {
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    fill.style.width = (score * 20) + "%";
    label.textContent = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][score - 1] || "-";
}

pass.oninput = () => checkStrength(pass.value);

form.onsubmit = e => {
    e.preventDefault();

    if (!site.value || !user.value || !pass.value) {
        alert("Fill all fields!");
        return;
    }

    passwords.push({
        id: Date.now(),
        site: site.value,
        user: user.value,
        pass: pass.value
    });

    save();
    display();
    form.reset();
    fill.style.width = "0%";
    label.textContent = "-";
};

search.oninput = () => {
    const q = search.value.toLowerCase();
    display(passwords.filter(x =>
        x.site.toLowerCase().includes(q) ||
        x.user.toLowerCase().includes(q)
    ));
};

display();