const express = require("express");
const router = express.Router();

const authenticate = require('../helper/commonresponse'); 

const category = require('../controller/categorycontroller')
const store = require('../controller/storecontroller')
const user = require('../controller/usercontroller')
const product = require('../controller/productcontroller')
const auth = require('../controller/authcontroller')


router.post('/createCategory',category.addCategory)
router.get('/master/product-category/list',category.getCategories)
router.post('/addstore',store.addStore)
router.get('/store',store.getStoreDetails)
router.get('/store/list',store.listStores)
router.patch('/updatestore',store.updateStore)
router.post('/usercreate',user.createProfile)
router.get('/store/user',user.getProfile)
router.patch('/store/user/:storeUserId',user.updateProfile)
router.post('/store/products/list',product.listStoreProducts)
router.post('/store/products',product.addStoreProduct)
router.post('/store/products/add-stock',product.addStock)
router.post('/store/products/remove-stock',product.removeStock)
router.post('/store/products/inventory/list',product.getInventoryList)
router.post('/generateOtp',auth.generateOTP)
router.post('/verifyOtp',auth.verifyOtp)
router.post('/refreshToken',auth.refreshToken)

module.exports = router;
