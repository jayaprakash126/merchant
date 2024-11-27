
const store = require('../model/storemodel')


const addStore = async (req, res) => {
    try {
        const { name, location, category, contactNo, dialCode, openingTime, closingTime, upi, payAtStoreCommission, ecommerceCommission, images, schedule, status } = req.body;

        if (!name || !location || !category || !contactNo || !dialCode || !openingTime || !closingTime || !upi || !payAtStoreCommission || !ecommerceCommission) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const newStore = new store({
            name,
            location,
            category,
            contactNo,
            dialCode,
            openingTime,
            closingTime,
            upi,
            payAtStoreCommission,
            ecommerceCommission,
            images,
            schedule,
            status
        });
        const savedStore = await newStore.save();
        return res.status(201).json({ success: true, message: 'Store added successfully.', data: savedStore });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding store.', error: error.message });
    }
};


const getStoreDetails = async (req, res) => {
    try {
        const storeId = req.body.storeId;
        if (!storeId) {
            return res.status(400).json({ success: false, message: 'Store ID is required.' });
        }
        const storeDetails = await store.find({ _id: storeId });
        if (!storeDetails || storeDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'No store found.' });
        }

        const storeData = storeDetails.map(store => ({
            name: store.name,
            location: store.location,
            category: store.category,
            address: store.address,
            contactNo: store.contactNo,
            dialCode: store.dialCode,
            openingTime: store.openingTime,
            closingTime: store.closingTime,
            upi: store.upi,
            payAtStoreCommission: store.payAtStoreCommission,
            ecommerceCommission: store.ecommerceCommission,
            status: store.status,
        }));
        return res.status(200).json({ success: true, data: storeData });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching store details.', error: error.message });
    }
};



const listStores = async (req, res) => {
    try {
        const { limit, pageNo } = req.body; 
        const skip = (pageNo - 1) * limit;
        const totalCount = await store.countDocuments();
        const stores = await store.find().skip(skip).limit(limit);

        if (!stores || stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No stores found.',
            });
        }
        const response = {
            totalCount,
            data: stores.map(store => ({
                name: store.name,
                location: store.location,
                category: store.category,
                address: store.address,
                contactNo: store.contactNo,
                dialCode: store.dialCode,
                openingTime: store.openingTime,
                closingTime: store.closingTime,
                upi: store.upi,
                payAtStoreCommission: store.payAtStoreCommission,
                ecommerceCommission: store.ecommerceCommission,
                status: store.status,
            })),
            limit: limit,
            pageNo: pageNo,
            // token: req.user && req.user.role === 'organization' ? req.headers.authorization : undefined  
        };

        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching stores.', error: error.message });
    }
};


const updateStore = async (req, res) => {
    try {
        const storeId = req.body.storeId;
        const updateData = req.body;
        if (!storeId) {
            return res.status(400).json({ success: false, message: 'Store ID is required.' });
        }

        const updatedStore = await store.findByIdAndUpdate(storeId, updateData, { new: true });

        if (!updatedStore) {
            return res.status(404).json({ success: false, message: 'Store not found.' });
        }

        return res.status(200).json({ success: true, isSuccess: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating store.', error: error.message });
    }
};


module.exports = { getStoreDetails, listStores, updateStore, addStore };
