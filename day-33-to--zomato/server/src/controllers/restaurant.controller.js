const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menuItem.model");
const getPagination = require("../utils/pagination");
const findOwnedRestaurant = require("../utils/ownership");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

// Turns lng/lat from the request body into a GeoJSON point (or null if invalid)
function buildLocation(lng, lat) {
  const longitude = Number(lng);
  const latitude = Number(lat);

  const isValid =
    lng !== undefined &&
    lat !== undefined &&
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90;

  return isValid ? { type: "Point", coordinates: [longitude, latitude] } : null;
}

// GET /api/restaurants?page=1&limit=10&city=Bhopal
async function getRestaurants(req, res) {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (req.query.city) {
    filter.city = String(req.query.city);
  }

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter).sort({ name: 1, _id: 1 }).skip(skip).limit(limit),
    Restaurant.countDocuments(filter),
  ]);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    restaurants,
  });
}

// GET /api/restaurants/:id
async function getRestaurantById(req, res) {
  const restaurant = await Restaurant.findById(req.params.id).populate(
    "owner",
    "name",
  );
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  res.json({ restaurant });
}

// POST /api/restaurants  (owner)
// Body: { name, city, area, cuisines: [], lng, lat, isOpen }
async function createRestaurant(req, res) {
  const { name, city, area, cuisines, lng, lat, isOpen } = req.body;

  const location = buildLocation(lng, lat);
  if (!location) {
    return res.status(400).json({ message: "Valid lng and lat are required" });
  }

  const restaurant = await Restaurant.create({
    name,
    owner: req.user.id,
    city,
    area,
    cuisines,
    location,
    isOpen,
  });

  res.status(201).json({ restaurant });
}

// PATCH /api/restaurants/:id  (owner, own restaurant only)
async function updateRestaurant(req, res) {
  const { restaurant, error } = await findOwnedRestaurant(
    req.params.id,
    req.user.id,
  );
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  // Only these fields can be changed
  const allowedFields = ["name", "city", "area", "cuisines", "isOpen"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      restaurant[field] = req.body[field];
    }
  }

  if (req.body.lng !== undefined || req.body.lat !== undefined) {
    const location = buildLocation(req.body.lng, req.body.lat);
    if (!location) {
      return res
        .status(400)
        .json({ message: "Send both lng and lat with valid values" });
    }
    restaurant.location = location;
  }

  await restaurant.save();
  res.json({ restaurant });
}

// DELETE /api/restaurants/:id  (owner, own restaurant only)
async function deleteRestaurant(req, res) {
  const { restaurant, error } = await findOwnedRestaurant(
    req.params.id,
    req.user.id,
  );
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  // Remove the menu too. Old orders and reviews are kept for history.
  await MenuItem.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();

  res.json({ message: "Restaurant deleted" });
}

// GET /api/restaurants/:id/revenue (owner, own restaurant only)
async function getRestaurantRevenue(req, res) {
  const id = req.params.id;
  const to = req.params.to ? new Date(req.params.to) : new Date.now();
  const from = req.params.from
    ? new Date(req.params.from)
    : new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  from.setHours(0, 0, 0, 0);

  /**
   * res = {
   * message: "Revenue fetched successfully",
   * revenue: 1000, // example revenue value
   * from : "2024-06-01T00:00:00.000Z", // example from date
   * to: "2024-06-08T00:00:00.000Z" // example to date
   * days: [
   *  {date: "2024-06-01", revenue: 100}, // example daily revenue
   *  {date: "2024-06-02", revenue: 150},
   *  {date: "2024-06-03", revenue: 200},
   *  {date: "2024-06-04", revenue: 250},
   *  {date: "2024-06-05", revenue: 300},
   *  {date: "2024-06-06", revenue: 350},
   *  {date: "2024-06-07", revenue: 400}
   * ]
   * }
   */

  const response = await Order.aggregate([
    {
      $match: {
        status: "delivered",
        restaurant: new mongoose.Types.ObjectId(id),
        createdAt: { $gte: from, $lte: to },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%d-%m-%Y",
            date: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$revenue",
        },
        days: {
          $push: "$$ROOT",
        },
      },
    },
  ]);

  res.status(200).json({
    message: "Revenue fetched successfully",
    revenue: response[0]?.totalRevenue || 0,
    from: from.toISOString(),
    to: to.toISOString(),
    days: response[0]?.days || [],
  });
}

// GET /api/restaurants/:id/top-customers (owner, own restaurant only)
async function getTopCustomers(req, res) {
  const id = req.params.id;

  const response = await Order.aggregate([
    {
      $match: {
        status: "delivered",
        restaurant: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$customer",
        totalRevenue: {
          $sum: "$totalAmount",
        },
        totalOrder: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        totalRevenue: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$users",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $limit: 3,
    },
  ]);

  return res.status(200).json({
    message: "Top customers fetched successfully",
    topCustomers: response || [],
  });
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantRevenue,
  getTopCustomers
};
