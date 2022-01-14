
console.log(arrayProyectos);

const inputProyecto = document.getElementById('proyecto');

inputProyecto.addEventListener('change', function () {            

    // dividimos el valor del input proyecto en dos partes
    const arrayProyecto = inputProyecto.value.split(' - ');

    // preguntamos si el arrayProyecto tiene dos elementos y si el primer elemento es un numero
    if (arrayProyecto.length == 2 && !isNaN(arrayProyecto[0])) {
        // buscamos el idProyecto en el arrayProyectos
        const proyecto = arrayProyectos.find(proyecto => proyecto.idProyecto == arrayProyecto[0]);
        // si existe el idProyecto, le asignamos el valor del nombreProyecto al input proyecto
        if (proyecto) {
            // asigno valor al input proyecto e idProyecto
            document.getElementById('idProyecto').value = proyecto.idProyecto;
            inputProyecto.value = proyecto.nombreProyecto;
        } else {
            // si no existe el proyecto
            document.getElementById('idProyecto').value = '';
            inputProyecto.value = "";
        }

    } else {
        //  inputProyecto no tiene guion ó no es un numero
        document.getElementById('idProyecto').value = '';
        inputProyecto.value = "";
    }
});
