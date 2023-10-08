const Pool = require("./../config/dbconfig");

const selectDataUser = (data) => {
  let { searchBy, search, sortBy, sort, limit, offset } = data;
  let qry = `SELECT id,email,fullname,photo,created_at,role
  FROM users 
  WHERE users.${searchBy} ILIKE '%${search}%' AND users.deleted_at IS NULL ORDER BY users.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`;
  return Pool.query(qry);
};

const insertDataUser = (data) => {
  let { name, email, phonenumber, password } = data;
  let qry = `INSERT INTO old_users(name,email,phonenumber,password) VALUES('${name}','${email}','${phonenumber}',crypt('${password}',gen_salt('bf')) ) `;
  return Pool.query(qry);
};

const selectDataUserById = (id) => {
  let qry = `SELECT id,email,fullname,photo,created_at,role 
  FROM users WHERE id='${id}'`
  return new Promise((resolve, reject) =>
    Pool.query(qry, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const findUser = (email) => {
  let qry = `SELECT * FROM users WHERE email='${email}'`;
  return new Promise((resolve, reject) =>
    Pool.query(qry, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const createUser = (data) => {
  const { email, fullname, password, id, role } = data;
  let qry = `INSERT INTO users(id,email,fullname,password,created_at,role) 
  VALUES('${id}','${email}','${fullname}','${password}', NOW()::timestamp,'${role}')`;
  return new Promise((resolve, reject) =>
    Pool.query(qry, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

module.exports = {
  selectDataUser,
  insertDataUser,
  selectDataUserById,
  findUser,
  createUser,
};
