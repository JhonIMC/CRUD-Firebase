const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container')
let editStatus = false;
let id = '';

const saveTask = (title, descripcion) => 
    db.collection('tasks').doc().set({
        title,
        descripcion
    })

const getTasks = () => db.collection('tasks').get();
const getTask = (id) => db.collection('tasks').doc(id).get();
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);
const deleteTask = id => db.collection('tasks').doc(id).delete();
const updateTask = (id, updateTask) => db.collection('tasks').doc(id).update(updateTask);

window.addEventListener('DOMContentLoaded', async(e) => {    

    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
    
            const task = doc.data();
            task.id = doc.id;
    
            taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
                <h3 class="h5">${task.title}</h3>
                <p>${task.descripcion}</p>
                <div>
                    <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
                    <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
                </div>
            </div>
            `

            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await deleteTask(e.target.dataset.id);
                })
            })
            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskForm['task-title'].value = task.title;
                    taskForm['task-description'].value = task.descripcion;
                    taskForm['btn-task-form'].innerText = 'Update'
                })
            })
        })        
    })
})

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    // Obtener los Valores del Form
    const title = taskForm['task-title'];
    const descripcion = taskForm['task-description'];

    if(!editStatus){
        await saveTask(title.value, descripcion.value);
    } else{
        await updateTask(id, {
            title: title.value,
            descripcion: descripcion.value
        })
        editStatus = false;
        id = '';
        taskForm['btn-task-form'].innerText = 'Save'
    }

    await getTasks();
    taskForm.reset();
    title.focus();
})