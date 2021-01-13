const User = require('../daos/user.dao');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;
const jwt = require('jsonwebtoken');
const savePicture = require('../utils/savePicture');

const signUp = async (req, res) => {
  try {
    let inputData = req.body;
    const rules = {
      name: 'required|max:40',
      last_name: 'required|max:60',
      email: 'required|email',
      password: 'required|min:8|max:16',
      image_profile: 'required|picture',
    };

    const messages = {
      required: 'required',
      max: { string: 'max of :max' },
      min: 'min of :min',
      email: 'the value is not a valid format',
    };

    const validator = new Validator(inputData, rules, messages);

    if (validator.passes()) {
      const user_result = await User.searchByEmail(inputData.email);
      if (user_result) {
        return res.status(400).json({ status: 400, message: 'email already registered' });
      }

      // encrypt password with 12 salt rounds
      inputData.password = await bcrypt.hash(inputData.password, BCRYPT_SALT_ROUNDS);

      // decode base64 image and get image profile path
      const path_image_profile = await savePicture(inputData.image_profile, 'profiles');
      inputData.image_profile = process.env.HOST + path_image_profile;

      const user = await User.create(inputData);

      delete user.password;
      delete user.user_id;

      return res.status(201).json({ status: 201, message: 'created user successful', data: user });
    } else {
      const validatorErrors = validator.errors.errors;
      let errors = {};
      for (var error in validatorErrors) {
        if (validatorErrors.hasOwnProperty(error)) {
          errors[error] = validatorErrors[error][0];
        }
      }

      return res.status(400).json({ status: 400, message: 'invalid input data', errors });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    let inputData = req.body;

    const rules = {
      email: 'required|email',
      password: 'required|min:8|max:16',
    };

    const messages = {
      required: 'required',
      max: { string: 'max of :max' },
      min: 'min of :min',
      email: 'the value is not a valid format',
    };

    const validator = new Validator(inputData, rules, messages);

    if (validator.passes()) {
      const user = await User.searchByEmail(inputData.email);

      // if user isn't registered return 400
      if (!user) {
        return res.status(400).json({ status: 400, message: 'email not registered' });
      }

      // compare both passwords
      const equalsPasswords = await bcrypt.compare(inputData.password, user.password);
      if (!equalsPasswords) {
        return res.status(400).json({ status: 400, message: 'invalid password' });
      }

      const token = jwt.sign({ user_id: user.user_id, roles: user.roles }, process.env.SECRET, {
        expiresIn: 86400,
      });

      delete user.user_id;
      delete user.password;
      delete user.roles;

      return res.status(200).json({ status: 200, message: 'successful login', data: user, token });
    } else {
      const validatorErrors = validator.errors.errors;
      let errors = {};
      for (var error in validatorErrors) {
        if (validatorErrors.hasOwnProperty(error)) {
          errors[error] = validatorErrors[error][0];
        }
      }

      return res.status(400).json({ status: 400, message: 'invalid input data', errors });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = { signUp, signIn };
