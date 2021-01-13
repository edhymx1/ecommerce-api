const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  try {
    const roles = req.roles;

    function isAdmin({ role }) {
      return role === 'administrator';
    }

    const role = roles.find(isAdmin);

    if (role) {
      next();
    } else {
      return res.status(400).json({ status: 400, message: `you don't have access` });
    }
  } catch (error) {
    return res.status(400).json({ status: 400, message: `you don't have access` });
  }
};

const isEmployee = (req, res, next) => {
  try {
    const roles = req.roles;

    function isEmployee({ role }) {
      return role === 'employee';
    }

    const role = roles.find(isEmployee);

    if (role) {
      next();
    } else {
      return res.status(400).json({ status: 400, message: `you don't have access` });
    }
  } catch (error) {
    return res.status(400).json({ status: 400, message: `you don't have access` });
  }
};

const isCustomer = (req, res, next) => {
  try {
    const roles = req.roles;

    function isCustomer({ role }) {
      return role === 'customer';
    }

    const role = roles.find(isCustomer);

    if (role) {
      next();
    } else {
      return res.status(400).json({ status: 400, message: `you don't have access` });
    }
  } catch (error) {
    return res.status(400).json({ status: 400, message: `you don't have access` });
  }
};

module.exports = { isAdmin, isEmployee, isCustomer };
