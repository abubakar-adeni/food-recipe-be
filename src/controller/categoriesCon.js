const ApiResult = require("../middleware/error/ApiResult");

const {
  selectDataCategory,
  insertDataCategory,
  selectDataCategoryById,
  updateDataCategory,
  deleteDataCategory,
} = require("../model/categoryModel");

const categoriesController = {
  getAllCategories: async (req, res, next) => {
    try {
      let { searchBy, search, sortBy, sort } = req.query;
      let data = {
        searchBy: searchBy || "category_name",
        search: search || "",
        sortBy: sortBy || "category_name",
        sort: sort || "ASC",
      };
      data.page = parseInt(req.query.page) || 1;
      data.limit = parseInt(req.query.limit) || 10;
      data.offset = (data.page - 1) * data.limit;
      let showCategory = await selectDataCategory(data);
      if (showCategory.rows.length === 0) {
        next(
          ApiResult.badRequest(
            `Data not Found, category with ${data.searchBy} = ${data.search} does not exist`
          )
        );
        return;
      }
      next(ApiResult.success(`Data found`, showCategory.rows))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },

  getCategoryById: async (req, res, next) => {
    try {
      let id = req.params.id;
      let foundCategory = null;
      let showCategory = await selectDataCategoryById(id);
      showCategory.rows.map((item) => {
        if (item.id == id) {
          foundCategory = item;
        }
      });
      console.log(showCategory.rows);
      if (!foundCategory) {
        next(ApiResult.badRequest(`Bad request, data category not found`));
        return;
      }
      next(ApiResult.success(`Data found`, showCategory.rows))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },

  postDataCategory: async (req, res, next) => {
    try {
      let data = {};
      data.category_name = req.body.category_name;
      let result = await insertDataCategory(data);
      if (!result) {
        next(ApiResult.badRequest(`Failed to insert category data`));
        return;
      }
      next(ApiResult.success(`Data inserted successfully`, `${data.id} deleted`))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },

  putDataCategory: async (req, res, next) => {
    try {
      let result;
      let id = req.params.id;
      let showCategory = await selectDataCategoryById(id);
      let currentCategory = showCategory.rows[0];
      //cek if value is undefined
      let data = {
        category_name: req.body.category_name || currentCategory.category_name,
      };
      result = await updateDataCategory(id, data);
      if (!result) {
        next(ApiResult.badRequest(`Update data category failed`));
        return;
      }
      let checkData = await selectDataCategoryById(id);
      next(ApiResult.success(`Update data category successful`, checkData.rows))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },

  deleteDataCategory: async (req, res, next) => {
    try {
      let id = req.params.id;
      let showCategory = await selectDataCategoryById(id);
      let currentCategory = showCategory.rows[0];
      if (!currentCategory) {
        next(ApiResult.badRequest(`Category with id ${id} does not exist`));
        return;
      }
      let result = await deleteDataCategory(id);
      if (!result) {
        next(ApiResult.badRequest(`Delete data category failed`));
        return;
      }
      next(ApiResult.success(`Delete data category successful`, `${id} deleted`))
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },
};

module.exports = categoriesController;
