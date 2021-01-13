const pool = require('../database');

const queries = {
    insert: 'INSERT INTO users(name, last_name, email, password, image_profile) VALUES(?,?,?,?,?)',
    searchByUserId: 'SELECT * FROM users WHERE user_id = ? LIMIT 1',
    searchByEmail: 'SELECT * FROM users WHERE email = ? LIMIT 1',
    searchRolesByRoleName: 'SELECT * FROM roles WHERE role = ? LIMIT 1',
    insertUseRoles: 'INSERT INTO user_roles(user_id, role_id) VALUES (?,?)',
    getRolesByUserId: `SELECT r.* FROM users u
                            JOIN user_roles ur ON u.user_id = ur.user_id
                            JOIN roles r ON ur.role_id = r.role_id
                                WHERE u.user_id = ?`,
};

const create = ({ name, last_name, email, password, image_profile }) => {
    return new Promise(async (resolve, reject) => {
        const conn = await pool.getConnection();
        try {
            // start transaction
            await conn.beginTransaction();

            // user result
            const result = await conn.query(queries.insert, [
                name,
                last_name,
                email,
                password,
                image_profile ? image_profile : null,
            ]);

            // save user_id from user result
            const user_id = result[0].insertId;

            // search customer role_id
            const roles_result = await conn.query(queries.searchRolesByRoleName, 'customer');
            const role_id = roles_result[0][0].role_id;

            // insert user_id and role_id to the table user_roles
            await conn.query(queries.insertUseRoles, [user_id, role_id]);

            // search user by user_id and return this
            const users = await conn.query(queries.searchByUserId, user_id);

            const user = users[0][0];

            // commit transaction
            await conn.commit();

            return resolve(user);
        } catch (error) {
            // rollback transaction
            conn.rollback();
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
            let user = result[0].length > 0 ? result[0][0] : null;
            console.log(user);
            if (user) {
                const roles_res = await conn.query(queries.getRolesByUserId, user.user_id);
                const roles = roles_res[0];

                user.roles = roles;
            }

            return resolve(user);
        } catch (error) {
            return reject(error);
        } finally {
            conn.release();
        }
    });
};

module.exports = { create, searchByEmail };
