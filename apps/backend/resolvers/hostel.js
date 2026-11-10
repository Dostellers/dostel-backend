const Hostel = require('../../models/hosting');

module.exports = {
  hostels: () => {
    return Hostel.find().then((hostels) => hostels);
  },

  createHostel: async (name, location) => {
    const newHostel = new Hostel({ name, location });

    try {
      await newHostel.save();
      return newHostel;
    } catch (error) {
      console.error('Error creating hostel:', error);
      throw error;
    }
  },

  updateHostel: async (hostelId, hostelData) => {
    try {
      const result = await Hostel.findByIdAndUpdate(
        hostelId,
        hostelData,
        { new: true }
      );
      if (!result) {
        throw new Error('Hostel not found');
      }
      return result;
    } catch (error) {
      console.error('Error updating hostel:', error);
      throw error;
    }
  },

  deleteHostel: async (hostelId) => {
    try {
      await Hostel.findByIdAndDelete(hostelId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting hostel:', error);
      throw error;
    }
  }
};