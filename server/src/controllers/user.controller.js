import User from '../models/user.model.js';
import mongoose from 'mongoose';

/**
 * Utility function to handle errors and send responses
 */
const handleError = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
};

/**
 * Get all users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    return res.status(200).json({ users });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Get a single user by ID
 */
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Create a new user with transaction support
 */
export const createUser = async (req, res) => {
  const { firstName, lastName, puid, dormName, dob, collegeYear } = req.body;

  // Basic validation
  if (!firstName || !puid || !dob) {
    return res.status(400).json({ error: 'firstName, puid, and dob are required fields' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user] = await User.create(
      [{ firstName, lastName, puid, dormName, dob, collegeYear }],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({ user });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(res, error);
  }
};

/**
 * Update an existing user by ID
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, puid, dormName, dob, collegeYear } = req.body;

  const updateData = {
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(puid && { puid }),
    ...(dormName && { dormName }),
    ...(dob && { dob }),
    ...(collegeYear && { collegeYear }),
  };

  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      new: true,
    }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted', user });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * Generate a report using both ORM (20%) and prepared-statement-like (80%) approaches
 */
export const generateReport = async (req, res) => {
  const { dorm, collegeYear, dobFrom, dobTo } = req.body;

  try {
    // ORM Usage (20%) - Simple validation
    if (dorm) {
      const dormExists = await User.exists({ dormName: dorm });
      if (!dormExists) {
        return res.status(400).json({ success: false, message: 'Dorm not found' });
      }
    }

    // Get dorm capacity if specified
    let dormCapacity = 0;
    if (dorm) {
      const dormInfo = await User.findOne({ dormName: dorm }).select('dormCapacity');
      dormCapacity = dormInfo?.dormCapacity || 0;
    }

    // Prepare match stage
    const matchStage = {};
    if (dorm) matchStage.dormName = dorm;
    if (collegeYear) matchStage.collegeYear = collegeYear;
    if (dobFrom || dobTo) {
      matchStage.dob = {};
      if (dobFrom) matchStage.dob.$gte = new Date(dobFrom);
      if (dobTo) matchStage.dob.$lte = new Date(dobTo);
    }

    // Fetch stats and users in parallel
    const [reportResult, users] = await Promise.all([
      User.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgAge: {
              $avg: {
                $divide: [
                  { $subtract: [new Date(), '$dob'] },
                  1000 * 60 * 60 * 24 * 365.25,
                ],
              },
            },
            diningUserCount: { $sum: { $cond: [{ $eq: ['$hasDining', true] }, 1, 0] } },
          },
        },
      ]),
      User.find(matchStage).lean(),
    ]);

    const stats = reportResult[0] || { total: 0, avgAge: 0, diningUserCount: 0 };
    let dormOccupancyPercent = 0;
    if (dorm && dormCapacity > 0) {
      dormOccupancyPercent = (stats.total / dormCapacity) * 100;
    }

    return res.status(200).json({
      success: true,
      users,
      stats: {
        total: stats.total,
        avgAge: stats.avgAge ? stats.avgAge.toFixed(1) : 0,
        diningUserCount: stats.diningUserCount,
        dormOccupancyPercent: dormOccupancyPercent.toFixed(2),
      },
    });

  } catch (error) {
    console.error('Report error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
