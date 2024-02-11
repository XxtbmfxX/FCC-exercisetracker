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