const mime = require('mime');
const fs = require('fs');

const savePicture = (base64image, carpet) => {
    return new Promise((resolve, reject) => {
        try {
            let matches = base64image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let response = {};

            if (!matches) {
                return reject(new Error('invalid base64 string'));
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');
            let decodedImg = response;
            let imageBuffer = decodedImg.data;
            let type = decodedImg.type;
            let extension = mime.getExtension(type);

            if (!fs.existsSync(__dirname + `/../public/pictures/${carpet}`)) {
                fs.mkdirSync(__dirname + `/../public/pictures/${carpet}`, { recursive: true });
            }
            const filename = getUniqueID() + '.' + extension;
            const path = __dirname + `/../public/pictures/${carpet}/` + filename;
            fs.writeFileSync(path, imageBuffer, 'utf8');
            return resolve(`/pictures/${carpet}/` + filename);
        } catch (error) {
            return reject(error);
        }
    });
};

const getUniqueID = () => {
    return Date.now() + (Math.random() * 100000).toFixed();
};

module.exports = savePicture;
