import PasswordValidator from "password-validator";

const validator = new PasswordValidator();
validator
  .is()
  .min(6)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols()
  .has()
  .not()
  .spaces();

const passwordRequirements: { [key: string]: string } = {
  min: "Must have at least 6 characters.",
  digits: "Must have at least a number.",
  uppercase: "Must have uppercase.",
  lowercase: "Must have lowercase.",
  symbols: "Must have a special character (@, #, $, etc.).",
  spaces: "Must not contain spaces.",
};

export { validator, passwordRequirements };
