const pool = require('../database');

const queries = {
    insert: 'INSERT INTO users(name, last_name, email, password, image_profile) VALUES(?,?,?,?,?)',
    searchByUserId: 'SELECT * FROM users WHERE user_id = ? LIMIT 1',
    searchByEmail: 'SELECT * FROM users WHERE email = ? LIMIT 1',
};

const create = ({ name, last_name, email, password, image_profile }) => {
    return new Promise(async (resolve, reject) => {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(queries.insert, [
                name,
                last_name,
                email,
                password,
                image_profile ? image_profile : null,
            ]);
            const insert_id = result[0].insertId;
            const users_res = await conn.query(queries.searchByUserId, insert_id);
            return resolve(users_res[0][0]);
        } catch (error) {
            return reject(error);
        } finally {
            conn.release();
        }
    });
};

const searchByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        const conn = await pool.getConnection();
        try {
            const result = await conn.query(queries.searchByEmail, email);
            const user = result[0].length > 0 ? result[0][0] : null;
            return resolve(user);
        } catch (error) {
            return reject(error);
        } finally {
            conn.release();
        }
    });
};

module.exports = { create, searchByEmail };
