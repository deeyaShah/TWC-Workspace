import Address from '../Models/Address.js';

// Save new address
 const saveAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body, user: req.user.id });
    await address.save();
    res.status(201).json({ message: 'Address saved successfully', address });
  } catch (error) {
    res.status(500).json({ message: 'Error saving address', error });
  }
};
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ This must match the logged-in user
        const addresses = await Address.find({ user: userId });
        res.json(addresses);
      } catch (error) {
        console.error('Error getting address:', error);
        res.status(500).json({ message: 'Server error' });
      }
  };
  
// Update address by ID
 const updateAddress = async (req, res) => {
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ message: 'Address updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error });
  }
};

// Delete (soft delete) address
 const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDeleted: true }
    );
    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};
export default {
    saveAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
}
