function convertirFecha(fecha) {
    var date = new Date(fecha);
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var anio = date.getFullYear();
    if (dia < 10) {
        dia = "0" + dia;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }
    var fechaString = dia + "/" + mes + "/" + anio;
    return fechaString;
}

console.log('its ok');