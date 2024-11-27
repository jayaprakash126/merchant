const category = require('../model/categorymodel')

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body; 
        const newcategory = new category({ name,description });
        const savedcategory = await newcategory.save();
        return res.status(201).json({ success: true, message: 'Category added successfully.', data: savedcategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding category.', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
      const { limit , pageNo } = req.body; 
      const skip = (pageNo - 1) * limit;
      const totalCount = await category.countDocuments(); 
      const categories = await category.find()
        .skip(skip)
        .limit(limit); 
  
      return res.status(200).json({ success: true, totalCount, data: categories, limit, pageNo });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error fetching categories.', error: error.message });
    }
  };
  

module.exports = { addCategory, getCategories }