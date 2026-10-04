// ==========================================
// VOICE-TO-TASK ASSISTANT
// ==========================================


// ---------- ELEMENTS ----------

const voiceButton = document.getElementById("voiceButton");
const transcript = document.getElementById("transcript");
const listeningText = document.getElementById("listeningText");

const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");


// ---------- TASK STORAGE ----------

// Get saved tasks from browser
let tasks = JSON.parse(localStorage.getItem("voiceTasks")) || [];


// Save tasks
function saveTasks() {
    localStorage.setItem("voiceTasks", JSON.stringify(tasks));
}


// ---------- LOAD TASKS ----------

function loadTasks() {

    // If there are no saved tasks,
    // keep the sample tasks already in HTML.
    if (tasks.length === 0) {
        return;
    }

    taskList.innerHTML = "";

    tasks.forEach((task) => {
        createTaskCard(task);
    });
}


// ---------- CREATE TASK CARD ----------

function createTaskCard(task) {

    const taskCard = document.createElement("div");

    taskCard.className = "task-card";

    if (task.completed) {
        taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `
        <div class="task-content">

            <div class="priority ${task.priority === "high" ? "high" : "medium"}">
                ${task.priority.toUpperCase()} PRIORITY
            </div>

            <h3>${task.name}</h3>

            ${task.assignee ? `<p>👤 ${task.assignee}</p>` : ""}

            <div class="task-details">
                📅 ${task.date || "No deadline"}
                ${task.time ? ` • ⏰ ${task.time}` : ""}
            </div>

        </div>

        <div class="task-actions">

            <button class="complete-button">
                ${task.completed ? "↩" : "✓"}
            </button>

            <button class="edit-button">
                ✏️
            </button>

            <button class="delete-button">
                🗑️
            </button>

        </div>
    `;


    // ---------- COMPLETE ----------

    const completeButton =
        taskCard.querySelector(".complete-button");

    completeButton.addEventListener("click", () => {

        task.completed = !task.completed;

        saveTasks();

        taskList.innerHTML = "";

        tasks.forEach((task) => {
            createTaskCard(task);
        });
    });


    // ---------- EDIT ----------

    const editButton =
        taskCard.querySelector(".edit-button");

    editButton.addEventListener("click", () => {

        const newTask = prompt(
            "Edit your task:",
            task.name
        );

        if (newTask && newTask.trim() !== "") {

            task.name = newTask.trim();

            saveTasks();

            taskList.innerHTML = "";

            tasks.forEach((task) => {
                createTaskCard(task);
            });
        }
    });


    // ---------- DELETE ----------

    const deleteButton =
        taskCard.querySelector(".delete-button");

    deleteButton.addEventListener("click", () => {

        const confirmed =
            confirm("Delete this task?");

        if (!confirmed) {
            return;
        }

        tasks = tasks.filter(
            (item) => item.id !== task.id
        );

        saveTasks();

        taskCard.remove();
    });


    taskList.appendChild(taskCard);
}


// ---------- ADD TASK ----------

addTaskButton.addEventListener("click", () => {

    const taskName = prompt(
        "Enter your task:"
    );

    if (!taskName || taskName.trim() === "") {
        return;
    }

    const newTask = {

        id: Date.now(),

        name: taskName.trim(),

        priority: "medium",

        date: "",

        time: "",

        assignee: "",

        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    createTaskCard(newTask);
});


// ---------- VOICE RECOGNITION ----------

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (!SpeechRecognition) {

    listeningText.textContent =
        "Speech recognition is not supported in this browser.";

} else {

    const recognition =
        new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-US";


    voiceButton.addEventListener("click", () => {

        recognition.start();

        voiceButton.style.transform =
            "scale(1.08)";

        listeningText.textContent =
            "🎙️ Listening... Speak now!";
    });


    recognition.onresult = (event) => {

        const speech =
            event.results[0][0].transcript;

        transcript.textContent =
            speech;

        listeningText.textContent =
            "✅ Got it! Your speech has been captured.";

        voiceButton.style.transform =
            "scale(1)";
    };


    recognition.onerror = () => {

        listeningText.textContent =
            "❌ Couldn't hear you. Please try again.";

        voiceButton.style.transform =
            "scale(1)";
    };


    recognition.onend = () => {

        voiceButton.style.transform =
            "scale(1)";
    };
}


// ---------- INITIAL LOAD ----------

loadTasks();