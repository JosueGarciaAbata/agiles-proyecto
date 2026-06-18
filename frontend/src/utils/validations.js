// Basados ene los fields y en lo que tiene el objeto.

const validationRules = {
  // Login
  ema_log: {
    required: true,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Debe ingresar un correo electrónico válido",
  },
  pas_log: {
    required: true,
    minLength: 3,
    message: "Contraseña invalida: minimo 3 caracteres",
  },
  dni_usr: {
    required: true,
    regex: /^\d{10}$/,
    message: "Contraseña invalida: 10 digitos",
  },
  // Usuarios
  role: {
    required: true,
    select: true,
    message: "Debe seleccionar un rol",
  },
  name: {
    required: true,
    minLength: 3,
    message: "El nombre dene tener al menos 3 caracteres",
  },
  email: {
    required: true,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Debe ingresar un correo electrónico válido",
  },
  password: {
    required: true,
    minLength: 8,
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message:
      "Contraseña invalida: debe tener mayusculas, minusculas, un dígito y al menos 8 caracteres",
  },
  // Responsables
  dni_res: {
    required: true,
    minLength: 10,
    maxLength: 10,
    message: "La cédula debe tener 10 caracteres numéricos",
    regex: /^[0-9]+$/,
  },
  nam_res: {
    required: true,
    minLength: 3,
    message: "El nombre debe tener al menos 3 caracteres",
  },
  las_res: {
    required: true,
    minLength: 3,
    message: "El apellido debe tener al menos 3 caracteres",
  },
  ema_res: {
    required: true,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Debe ingresar un correo electrónico válido",
  },
  pho_res: {
    required: true,
    regex: /^[0-9]{10}$/,
    message: "Debe ingresar un número de teléfono válido",
  },
  is_ext: {
    required: true,
    select: true,
    message: "Debe seleccionar un tipo",
  },
  // Ubicaciones
  cod_loc: {
    required: true,
    minLength: 3,
    message: "El código debe tener al menos 3 caracteres",
  },
  nam_loc: {
    required: true,
    minLength: 3,
    message: "El nombre debe tener al menos 3 caracteres",
  },
  // Proveedores
  id_num_sup: {
    required: true,
    minLength: 10,
    maxLength: 10,
    message: "La cédula debe tener 10 caracteres numéricos",
    regex: /^[0-9]+$/,
  },
  nam_sup: {
    required: true,
    minLength: 3,
    message: "El nombre debe tener al menos 3 caracteres",
  },
  ema_sup: {
    required: true,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Debe ingresar un correo electrónico válido",
  },
  pho_sup: {
    required: true,
    regex: /^[0-9]{10}$/,
    message: "Debe ingresar un número de teléfono válido",
  },
  // Ingresos
  cod_inc: {
    required: true,
    minLength: 3,
    message: "El código debe tener al menos 3 caracteres",
  },
  supplier_id: {
    required: true,
    select: true,
    message: "Debe seleccionar un proveedor",
  },
  est_inc: {
    required: true,
    select: true,
    message: "Debe seleccionar un estado",
  },
  date_inc: {
    required: true,
    message: "Debe seleccionar una fecha",
  },
  // Activos
  cod_ass: {
    required: true,
    minLength: 3,
    maxLength: 10,
    message: "Debe tener al menos 3 caracteres y máximo 10",
  },
  ser_num_ass: {
    required: true,
    minLength: 8,
    maxLength: 20,
    message: "Debe tener al menos 8 caracteres y máximo 20",
  },
  id_loc_ass: {
    required: true,
    selected: true,
    message: "Debe seleccionar una ubicaciónn",
  },
  id_inc_ass: {
    required: true,
    selected: true,
    message: "Debe selecciona un ingreso",
  },
  id_cat_ass: {
    required: true,
    selected: true,
    message: "Debe seleccionar algún tipo",
  },
  // Mantenimiento
  dni_res_main: {
    required: true,
    selected: true,
    message: "Debe seleccionar algún responsable",
  },
  cod_main: {
    required: true,
    minLength: 3,
    maxLength: 10,
    message: "El código debe tener mínimo 3 y máximo 10 caracteres",
  },
  id_typ_main: {
    required: true,
    selected: true,
    message: "Debe seleccionar algun mantenmiento",
  },
  created_at: {
    required: true,
    message: "Debe seleccionar una fecha",
  },
  ended_at: {
    required: true,
    message: "Debe seleccionar una fecha",
  },
};
// Todos los campos
export const validateFields = (data, fields) => {
  const errors = {};

  fields.forEach(({ key }) => {
    const rule = validationRules[key];
    const value = data[key];

    // Valida campos requeridos
    if (rule?.required && !value) {
      errors[key] = rule.message;
      // Valida longitud minima
    } else if (rule?.minLength && value?.length < rule.minLength) {
      errors[key] = `Debe tener al menos ${rule.minLength} caracteres`;
      // Valida las expresiones regulares
    } else if (rule?.maxLength && value?.length > rule.maxLength) {
      errors[key] = `No debe exceder de ${rule.maxLength} caracteres`;
    } else if (rule?.regex && !rule.regex.test(value)) {
      errors[key] = rule.message;
    } else if (rule?.select && !value) {
      errors[key] = rule.message;
    }
  });

  return errors;
};

// Un solo campo en tiempo real
export const validateField = (key, value) => {
  const rule = validationRules[key];

  // Valida el campo requerido
  if (rule?.required && !value) {
    return rule.message;
    // Valida la olngitud minima
  } else if (rule?.minLength && value?.length < rule.minLength) {
    return rule.message;
    // Valida la longitud maxima
  } else if (rule?.maxLength && value?.length > rule.maxLength) {
    return rule.message;
    // Validar expresiones regulares
  } else if (rule?.regex && !rule.regex.test(value)) {
    return rule.message;
  } else if (rule?.select && !value) {
    return rule.message;
  } else if (rule?.date && !value) {
    return rule.message;
  }

  return ""; // Sin error
};

export const generateErrorMessage = (errors) => {
  let message = "";

  console.log("Los errores son", errors);
  console.log(Object.entries(errors));
  Object.entries(errors).forEach(([key, errorMessages]) => {
    if (Array.isArray(errorMessages)) {
      message += errorMessages.join(" ") + " ";
    } else if (typeof errorMessages === "string") {
      message += errorMessages + " ";
    }
  });

  return message.trim(); // Eliminar espacios innecesarios al final
};

export const handleErrors = (errors) => {
  const errorMessages = [];

  for (const [key, messages] of Object.entries(errors)) {
    messages.forEach((message) => {
      errorMessages.push(`${message}`);
    });
  }

  return errorMessages;
};
