document.addEventListener("DOMContentLoaded",()=>{
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const TaskList = document.getElementById("task-list");
    const emptyImage = document.querySelector('.empty-image');
    const toDoContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');


    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTask(task.text, task.completed, false));
        toogleEmptyState();
        updateProgress(checkCompletion);
        saveTasks();
    };

     const saveTasks = () => {
        const tasks = [];
        TaskList.querySelectorAll("li").forEach(li => {
            tasks.push({
                text: li.querySelector("span").textContent,
                completed: li.querySelector(".checkbox").checked
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const toogleEmptyState = () => {
        emptyImage.style.display = TaskList.children.length === 0 ? 'block' : 'none';
        toDoContainer.style.width = TaskList.children.length === 0 ? '100%' : '100%';
    }


    const updateProgress = (checkCompletion = true) => {
        const totalTasks =  TaskList.children.length;
        const completedTasks =  TaskList.querySelectorAll('.checkbox:checked').length;
        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100 }%`: '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
    };
    const addTask = (text, completed = false , checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if(!taskText){
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
        <input type='checkbox' class='checkbox' ${completed ? 'checked' :''} />
        <span>${taskText}</span>
        <div class='task-buttons'>
            <button class='edit-btn'><i class="fas fa-pen"></i></button>
            <button class='del-btn'><i class="fas fa-trash"></i></button>
        </div>`;

        const editBtn = li.querySelector('.edit-btn');
        const checkbox = li.querySelector('.checkbox');

        if(completed){
            li.classList.add('completed')
            editBtn.disabled = true;
            editBtn.style.opacity = '.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const ischecked = checkbox.checked;
            li.classList.toggle('completed',ischecked);
            editBtn.disabled = ischecked;
            editBtn.style.opacity = ischecked? '.5' : '1';
            editBtn.style.pointerEvents = ischecked?'none':'auto';
            updateProgress();
            saveTasks();
            const totalTasks = TaskList.children.length;
            const completedTasks = TaskList.querySelectorAll('.checkbox:checked').length;

            if (totalTasks > 0 && completedTasks === totalTasks) {

                confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
                confetti({ particleCount: 180, angle: 30, spread: 55, origin: { y: 1 } });
                confetti({ particleCount: 80, angle: 90, spread: 55, origin: { y: 1 } });
                confetti({ particleCount: 80, angle: 120, spread: 55, origin: { y: 1 } });
                confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 0,y: 1 } });
                confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 1,y: 1 } });
                setTimeout(() => {
                    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 1 } });
                    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 1 } });
                }, 0);

                setTimeout(() => {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
                }, 300);
            }
            else if (ischecked) {
                confetti({
                    particleCount: 120,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        });
        editBtn.addEventListener('click',() => {
            if(!checkbox.checked){
                taskInput.value=li.querySelector('span').textContent;
                li.remove();
                toogleEmptyState();
                updateProgress(false);
                saveTasks();
            }
        });

        li.querySelector('.del-btn').addEventListener('click',() => {
            li.remove();
            toogleEmptyState();
            updateProgress();
            saveTasks();
        });

        TaskList.appendChild(li);
        taskInput.value = '';
        toogleEmptyState();
        updateProgress(checkCompletion);
        saveTasks();
    };

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });
    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            addTask();
        }
    });
    loadTasks();
});