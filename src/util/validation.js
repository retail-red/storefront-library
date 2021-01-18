export const isRequired = (value) => value && value.length;

export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const isPhone = (value) => value && value.length > 4;
