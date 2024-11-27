const product = require('../model/productmodel')

const listStoreProducts = async (req, res) => {
    try {
        const { limit, pageNo, category, name } = req.body; 
        // const authorization = req.headers['authorization'];
        // const device = req.headers['device']; 

        const query = {};

        if (category) query.category = category; 
        if (name) query.name = { $regex: name, $options: 'i' }; 
        const skip = (pageNo - 1) * limit;
        const totalCount = await product.countDocuments(query);
        const products = await product.find(query)
            .skip(skip)
            .limit(limit)
            .exec();
        const responseData = { totalCount, data: products, count: products.length, pageNo: parseInt(pageNo) };
        return res.status(200).json({ success: true, data: responseData });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching store products.', error: error.message });
    }
};

const addStoreProduct = async (req, res) => {
    try {
        const { name, description, category, discountType, discountValue, originalPrice, price, stock, unit, unitType, status, images, inventory, store } = req.body; 
        const newProduct = new product({ name, description, category, discountType, discountValue, originalPrice, price, stock, unit, unitType, status, images, inventory, store });
        const savedProduct = await newProduct.save();
        return res.status(201).json({ success: true, message: 'Product added successfully.', data: savedProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding store product.', error: error.message });
    }
};


const addStock = async (req, res) => {
    try {
        const productId = req.params.id; 
        const { stock } = req.body; 
    
        if (!stock || stock <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid stock value. Stock must be a positive number.' });
        }

        const Product = await product.findOne(productId);
        if (!Product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        Product.stock += stock;
        await Product.save();

        return res.status(200).json({ success: true, message: 'Stock added successfully.'});
    } catch (error) {
        console.error('Error adding stock:', error);
        return res.status(500).json({ success: false, message: 'Error adding stock.', error: error.message });
    }
};


const removeStock = async (req, res) => {
    try {
        const productId = req.params.id;
        const { stock } = req.body;
        if (!stock || stock <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid stock value. Stock to remove must be a positive number.' });
        }

        const Product = await product.findOne(productId);
        if (!Product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        if (Product.stock < stock) {
            return res.status(400).json({ success: false, message: 'Insufficient stock to remove.' });
        }

        Product.stock -= stock;
        await Product.save();
        return res.status(200).json({ success: true, message: 'Stock removed successfully.' });

    } catch (error) {
        console.error('Error removing stock:', error);
        return res.status(500).json({ success: false, message: 'Error removing stock.', error: error.message });
    }
};



const getInventoryList = async (req, res) => {
  try {
    const { limit = 10, order = {}, pageNo = 1, storeProduct, type, referenceType } = req.body;

    const query = {};

    if (storeProduct) {
      query._id = storeProduct;
    }

    const Product = await product.findOne(query).populate('inventory.createdBy', 'name email');

    if (!Product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    let filteredInventory = Product.inventory;

    if (type) {
      filteredInventory = filteredInventory.filter(item => item.type === type);
    }

    if (referenceType) {
      filteredInventory = filteredInventory.filter(item => item.referenceType === referenceType);
    }
    const skip = (pageNo - 1) * limit;
    const paginatedInventory = filteredInventory.slice(skip, skip + limit);


    const sortOrder = order.createdAt === 'desc' ? -1 : 1;
    paginatedInventory.sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)) * sortOrder);

    return res.status(200).json({
      success: true,
      message: 'Inventory list fetched successfully.',
      data: paginatedInventory,
      pagination: {
        totalRecords: filteredInventory.length,
        totalPages: Math.ceil(filteredInventory.length / limit),
        currentPage: pageNo,
        limit: limit,
      }
    });
  } catch (error) {
    console.error('Error fetching inventory list:', error);
    return res.status(500).json({ success: false, message: 'Error fetching inventory list', error: error.message });
  }
};



module.exports = { removeStock, addStoreProduct, addStock, listStoreProducts, getInventoryList };