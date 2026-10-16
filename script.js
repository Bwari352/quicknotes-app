
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const clearAllButton = document.querySelector("#clear-all-btn");

const STORAGE_KEY = "quicknotes-notes";

// Load previously saved notes.
let notes = [];

try {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    notes = savedNotes ? JSON.parse(savedNotes) : [];

    if (!Array.isArray(notes)) {
        notes = [];
    }
} catch (error) {
    notes = [];
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    filteredNotes.forEach(function (note) {
        const noteCard = document.createElement("li");

        noteCard.classList.add(
            "category-" + note.category.toLowerCase()
        );

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("category-label");
        categoryLabel.textContent = note.category;

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const date = document.createElement("small");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function () {
            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });

            saveNotes();
            render();
        });

        noteCard.append(
            categoryLabel,
            noteText,
            date,
            deleteButton
        );

        notesList.appendChild(noteCard);
    });

    // Show a message when a search has no matches.
    if (filteredNotes.length === 0 && searchTerm !== "") {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No notes match your search.";
        notesList.appendChild(emptyMessage);
    }

    // Update the count using all saved notes.
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

// Add a new note.
noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);
    saveNotes();

    errorMessage.textContent = "";
    noteInput.value = "";

    render();
});

clearAllButton.addEventListener("click", function () {
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render();
        errorMessage.textContent = "";
    }
});
// Search as the user types.
searchInput.addEventListener("input", render);

// Display saved notes on page load.
render();
