// ==============================
// ESTADO GLOBAL
// ==============================

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let filtroActual = localStorage.getItem("filtro") || "todas";


// ==============================
// GUARDAR EN LOCALSTORAGE
// ==============================

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}


// ==============================
// MOSTRAR TAREAS
// ==============================

function mostrarTareas() {

    const lista = document.getElementById("lista");
    const contador = document.getElementById("contador");

    lista.innerHTML = "";

    let tareasFiltradas = tareas;

    if (filtroActual === "pendientes") {
        tareasFiltradas = tareas.filter(t => !t.completada);
    } else if (filtroActual === "completadas") {
        tareasFiltradas = tareas.filter(t => t.completada);
    }

    // ==============================
    // ESTADO VACÍO
    // ==============================

    if (tareasFiltradas.length === 0) {
        lista.innerHTML = `<p class="vacio">No hay tareas</p>`;
    }

    // ==============================
    // CONTADOR
    // ==============================

    const pendientes = tareas.filter(t => !t.completada).length;
    const completadas = tareas.filter(t => t.completada).length;

    contador.textContent = `Pendientes: ${pendientes} | Completadas: ${completadas}`;

    // ==============================

    tareasFiltradas.forEach((tarea) => {

        const indexReal = tareas.indexOf(tarea);

        const li = document.createElement("li");

        // ANIMACIÓN ENTRADA
        li.classList.add("fade-in");

        const span = document.createElement("span");
        span.textContent = tarea.texto;

        if (tarea.completada) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        span.onclick = () => toggleCompletada(indexReal);

        // BOTONES
        const contenedorBtns = document.createElement("div");
        contenedorBtns.classList.add("acciones");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn-editar");
        btnEditar.onclick = () => editarTarea(indexReal, span);

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn-eliminar");

        btnEliminar.onclick = () => eliminarTarea(indexReal, li);

        contenedorBtns.appendChild(btnEditar);
        contenedorBtns.appendChild(btnEliminar);

        li.appendChild(span);
        li.appendChild(contenedorBtns);

        lista.appendChild(li);
    });
}


// ==============================
// AGREGAR TAREA
// ==============================

function agregarTarea() {

    const input = document.getElementById("tarea");
    const texto = input.value.trim();

    if (!texto) {
        alert("Escribe una tarea");
        return;
    }

    tareas.push({
        texto: texto,
        completada: false
    });

    guardarTareas();
    input.value = "";
    mostrarTareas();
}


// ==============================
// ELIMINAR TAREA (con animación)
// ==============================

function eliminarTarea(index, li) {

    if (!confirm("¿Eliminar tarea?")) return;

    li.classList.add("fade-out");

    setTimeout(() => {
        tareas.splice(index, 1);
        guardarTareas();
        mostrarTareas();
    }, 300);
}


// ==============================
// COMPLETAR TAREA
// ==============================

function toggleCompletada(index) {
    tareas[index].completada = !tareas[index].completada;
    guardarTareas();
    mostrarTareas();
}


// ==============================
// EDITAR TAREA
// ==============================

function editarTarea(index, span) {

    const input = document.createElement("input");
    input.type = "text";
    input.value = tareas[index].texto;

    span.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", function(e) {

        if (e.key === "Enter") {

            const nuevoTexto = input.value.trim();

            if (!nuevoTexto) {
                alert("No puede estar vacío");
                return;
            }

            tareas[index].texto = nuevoTexto;

            guardarTareas();
            mostrarTareas();
        }
    });
}


// ==============================
// FILTROS (GUARDAR)
// ==============================

function filtrar(tipo) {
    filtroActual = tipo;
    localStorage.setItem("filtro", tipo);
    mostrarTareas();
}


// ==============================
// ENTER PARA AGREGAR
// ==============================

document.getElementById("tarea").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        agregarTarea();
    }
});


// ==============================
// INICIO
// ==============================

mostrarTareas();