export const validarYConvertirFecha = (fechaString) => {
    // Validar si la fecha tiene el formato esperado (YYYY-MM-DD)
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fechaString)) {
      return false
    }
  
    // Convertir la cadena de texto a un objeto de tipo Date
    const fecha = new Date(fechaString);
  
    // Validar si la fecha resultante es válida
    if (isNaN(fecha.getTime())) {
      return false
    }
  
    // Devolver la fecha válida
    return fecha;
  }

export const formatearFecha = (fechaOriginal) => {

// Crear un objeto de fecha a partir de la cadena original
const fecha = new Date(fechaOriginal);

// Extraer el año, mes y día de la fecha
const año = fecha.getFullYear();
const mes = ("0" + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 porque los meses comienzan en 0
const dia = ("0" + fecha.getDate()).slice(-2);

// Formatear la fecha en la forma "yyyy-mm-dd"
const fechaFormateada = `${año}-${mes}-${dia}`;

return fechaFormateada
}