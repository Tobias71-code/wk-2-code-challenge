// Select DOM elements
const itemInput = document.getElementById("item-input");
const addItemBtn = document.getElementById("add-item-btn");
const clearListBtn = document.getElementById("clear-list-btn");
const shoppingList = document.getElementById("shopping-list");

// Array to hold the shopping list items
let items = [];

// Load the list from localStorage on page load
window.onload = function() {
    loadItemsFromLocalStorage();
};

// Add new item to the shopping list
function addItem() {
    const itemName = itemInput.value.trim();
    if (itemName === "") return;

    const newItem = {
        name: itemName,
        purchased: false
    };

    items.push(newItem);
    saveItemsToLocalStorage();
    renderItems();
    itemInput.value = ""; // Clear input field
}

// Toggle the purchased status of an item
function togglePurchased(index) {
    items[index].purchased = !items[index].purchased; // Toggle purchased status
    saveItemsToLocalStorage();
    renderItems();
}

// Delete an item from the list
function deleteItem(index) {
    items.splice(index, 1);
    saveItemsToLocalStorage();
    renderItems();
}

// Clear all items from the list
function clearList() {
    items = [];
    saveItemsToLocalStorage();
    renderItems();
}

// Save items to localStorage
function saveItemsToLocalStorage() {
    localStorage.setItem("shoppingList", JSON.stringify(items));
}

// Load items from localStorage
function loadItemsFromLocalStorage() {
    const storedItems = JSON.parse(localStorage.getItem("shoppingList"));
    if (storedItems) {
        items = storedItems;
        renderItems();
    }
}

// Render the items on the screen
function renderItems() {
    shoppingList.innerHTML = ""; // Clear current list
    items.forEach((item, index) => {
        const li = document.createElement("li");
        if (item.purchased) {
            li.classList.add("purchased"); // Add 'purchased' class for purchased items
        }
        li.innerHTML = `
            <span>${item.name}</span>
            <button class="purchase-btn" onclick="togglePurchased(${index})">
                ${item.purchased ? "Unmark" : "Mark as Purchased"}
            </button>
            <button onclick="editItem(${index})">Edit</button>
            <button onclick="deleteItem(${index})">Delete</button>
        `;
        shoppingList.appendChild(li);
    });
}

// Edit an item in the shopping list
function editItem(index) {
    const item = items[index];
    const li = shoppingList.children[index];

    // Replace the span with an input field
    const span = li.querySelector('span');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = item.name;

    // Replace span with the input field
    li.replaceChild(input, span);

    // Replace the Edit button with a Save button
    const editBtn = li.querySelector('button:nth-child(3)');
    editBtn.textContent = 'Save';
    editBtn.onclick = function() {
        saveEdit(index, input.value);
    };

    // Add a Cancel button to revert changes
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = function() {
        renderItems(); // Revert changes and restore original item
    };
    li.appendChild(cancelBtn);
}

// Save the edited item
function saveEdit(index, newName) {
    if (newName.trim() === "") return; // Don't save empty names
    items[index].name = newName.trim();
    saveItemsToLocalStorage();
    renderItems();
}

// Event Listeners
addItemBtn.addEventListener("click", addItem);
clearListBtn.addEventListener("click", clearList);

// Allow pressing Enter to add an item
itemInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addItem();
    }
});
