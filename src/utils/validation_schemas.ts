export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display Name cannot be empty",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};

export const getUsersFilterValidationSchema = {
  filter: {
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage:
        "Filter value must be at least 5 characters with a max of 10 characters",
    },
    notEmpty: {
      errorMessage: "Filter value cannot be empty",
    },
    isString: {
      errorMessage: "Filter value must be a string",
    },
  },
};

export const userAuthValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
  },
};
