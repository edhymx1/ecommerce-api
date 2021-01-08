const Validator = require('validatorjs');

Validator.register(
    'price',
    function (value, requirement, attribute) {
        return value.toString().match(/^\d+(.\d{2})?$/);
    },
    'the value is not a valid format'
);

Validator.register(
    'id',
    (value, requirement, attribute) => {
        return value.toString().match(/^[1-9]\d*$/);
    },
    'the value is not a valid format'
);

Validator.register(
    'picture',
    (value, requirement, attribute) => {
        return value.toString().match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    },
    'the value is not a valid format'
);

Validator.register(
    'stock',
    (value, requirement, attribute) => {
        return value.toString().match(/^\d+$/);
    },
    'the value is not a valid format'
);

Validator.register(
    'discount',
    (value, requirement, attribute) => {
        return value.toString().match(/^(\d(\d)?|100)$/);
    },
    'the value is not a valid format'
);
