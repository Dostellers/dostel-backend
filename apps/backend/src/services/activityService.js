const ActivityService = require('./activityService');

class ActivityService {
    constructor() {
        this.Activity = require('../models/activity');
    }

    async createActivity(input) {
        const newActivity = new this.Activity(input);
        return newActivity.save();
    }

    async getActivities(filter) {
        const query = { ...filter };
        return this.Activity.find(query);
    }

    async getActivitiesByHostel(hostelId) {
        return this.Activity.find({ hostel: hostelId });
    }

    async getActivityById(id) {
        return this.Activity.findById(id);
    }

    async updateActivity(id, updates) {
        return this.Activity.findByIdAndUpdate(id, updates);
    }

    async rsvpActivity(id, userId) {
        const activity = await this.Activity.findById(id);

        if (activity.currentAttendees >= activity.capacity) {
            throw new Error('Activity full');
        }

        activity.currentAttendees += 1;
        await activity.save();

        // Update user points if eligible (tier-based)
        if (user.tier in activity.tierAccess) {
            // Points logic from DOS-286 would go here
            return true;
        }

        return false;
    }

    async unrsvpActivity(id, userId) {
        // Implementation pending
        return false;
    }
}

module.exports = new ActivityService();