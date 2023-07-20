const Pool = require("./../config/dbconfig");

const selectDataCategory = (data) => {
  let { searchBy, search, sortBy, sort, limit, offset } = data;
  return Pool.query(`SELECT id, category_name, color, icon FROM categories WHERE categories.${searchBy} ILIKE '%${search}%' AND categories.deleted_at IS NULL ORDER BY categories.${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
};

const selectDataCategoryById = (data) => {
  let qry = `SELECT * FROM categories WHERE id='${data}' AND deleted_at IS NULL`;
  // console.log(data, query);
  return Pool.query(qry);
};

const insertDataCategory = (data) => {
  let { category_name } = data;
  let qry = `INSERT INTO categories(category_name) VALUES('${category_name}') `;
  // console.log(data, query);
  return Pool.query(qry);
};

const updateDataCategory = (id, data) => {
  let { category_name } = data;
  let qry = `UPDATE categories SET category_name='${category_name}' WHERE id=${id}`;
  console.log(data, qry);
  return Pool.query(qry);
};

const deleteDataCategory = (id) => {
  // let qry = `DELETE FROM categories WHERE id=${id}`;
  let qry = `UPDATE categories SET deleted_at = NOW()::timestamp WHERE id=${id}`;
  console.log(id, qry);
  return Pool.query(qry);
};

module.exports = {
  selectDataCategory,
  insertDataCategory,
  selectDataCategoryById,
  updateDataCategory,
  deleteDataCategory,
};
