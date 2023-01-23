window.onload = iniciar;
function iniciar() {
    document.getElementById("enviar").addEventListener('click', validar, false);
}

function validaNombre() {
    var elemento = document.getElementById("nombre");
    if (!elemento.checkValidity()) {
        if (elemento.validity.valueMissing) {
            error2(elemento, "Debe introducir un nombre");

        }
        return false
    }
    return true;
}

function validaMensaje() {
    var elemento = document.getElementById("comentario");
    if (!elemento.checkValidity()) {
        if (elemento.validity.valueMissing) {
            error2(elemento, "Debe introducir un mensaje");
        }
        if (elemento.value.length > 0 && elemento.value.length < 2) {
            error2(elemento, "El mensaje no puede tener menos de 2 caracteres");
        }
        if (elemento.value.length > 500) {
            error2(elemento, "El mensaje no puede tener más de 500 caracteres");
        }

        return false;

    }
    return true;
}

/*
function validaDias(){
    var elemento= document.getElementsByName("dia");
    for(var i=0; i<elemento.elements.length;i++){
        
    }
}
*/

function validaDias() {
    const semana = ["lunes", "martes", "miercoles", "jueves", "viernes"]
    let contador = 0;
    for (let i = 0; i < semana.length; i++) {
        const x = document.getElementById(semana[i]).checked;
        if (x == true) {
            contador++
        }
    }

    document.getElementById("confirmar").setAttribute("value", contador);

    const confirmacion = document.getElementById("confirmar");
    if (!confirmacion.checkValidity()) {
        alert(confirmacion.validationMessage);
    }
}

function selectall(form) {
    var formulario = eval(form)
    for (var i = 0, len = formulario.elements.length; i < len; i++) {
        if (formulario.elements[i].type == "checkbox"){
            formulario.elements[i].checked = formulario.elements[0].checked
    }
}
}




function validar(e) {
    borrarError();
    if (validaNombre() && validaMensaje() && validaDias() && confirm("Pulsa aceptar si deseas enviar el formulario")) {
        return true
    } else {
        e.preventDefault();
        return false;
    }
}

function error(elemento) {
    document.getElementById("mensajeError").innerHTML = elemento.validationMessage;
    elemento.className = "error";
    elemento.focus();
}

function error2(elemento, mensaje) {
    document.getElementById("mensajeError").innerHTML = mensaje;
    elemento.className = "error";
    elemento.focus();
}


function borrarError() {
    var formulario = document.forms[0];
    for (var i = 0; i < formulario.elements.length; i++) {
        formulario.elements[i].className = "";
    }
}