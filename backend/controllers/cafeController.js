// controllers/cafeController.js

const Cafe = require("../models/cafe");
const Employee = require("../models/employee");
const EmployeeCafeAssignment = require("../models/employeeCafeAssignment");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// MongoDB connection instance
const conn = mongoose.connection;

// Get all cafes, optionally filtered by location
const getAllCafes = async (req, res) => {
  const location = req.query.location; // Get the location query parameter
  try {
    // Query cafes based on location or fetch all
    let cafes = location
      ? await Cafe.find({ location: new RegExp(location, "i") }).lean()
      : await Cafe.find().lean();

    if (!cafes.length) return res.json([]); // Return empty array if no cafes found

    // Aggregate to count employees assigned to each cafe
    const cafeEmployeeCount = await EmployeeCafeAssignment.aggregate([
      { $group: { _id: "$cafeId", employeeCount: { $sum: 1 } } },
      { $sort: { employeeCount: -1 } }, // Sort by employee count in descending order
    ]);

    // Create a map of cafe IDs to employee counts
    const cafeMap = new Map(
      cafeEmployeeCount.map((c) => [c._id.toString(), c.employeeCount])
    );
    cafes.forEach((cafe) => {
      cafe.employeeCount = cafeMap.get(cafe.cafeId) || 0; // Assign employee count to cafe
    });

    // Sort cafes by employee count
    cafes.sort((a, b) => b.employeeCount - a.employeeCount);
    res.json(cafes); // Send cafes in the response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Create a new cafe
const createCafe = async (req, res) => {
  try {
    const file = req.file; // Get uploaded file
    console.log(req);
    if (!file) return res.status(500).send("File upload failed"); // Check if file exists
    // Create a new cafe with provided details
    const cafe = new Cafe({
      cafeId: uuidv4(), // Generate unique cafe ID
      name: req.body.name,
      description: req.body.description,
      logo: file.id, // Store uploaded logo file ID
      location: req.body.location,
    });

    await cafe.save(); // Save the cafe to the database
    res.status(201).json(cafe); // Respond with the created cafe
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Update an existing cafe
const updateCafe = async (req, res) => {
  try {
    const file = req.file; // Get uploaded file for update

    // If a new file is uploaded, delete the old logo from the database
    if (file) {
      const cafe = await Cafe.findOne({ cafeId: req.params.id });
      if (cafe && cafe.logo) {
        const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
        await bucket.delete(new mongoose.Types.ObjectId(cafe.logo)); // Delete old logo file
      }
      req.body.logo = file.id; // Update logo ID with new file
    } else {
      console.log("Image not updated"); // Log if no new image is provided
    }

    // Update cafe details in the database
    const cafe = await Cafe.findOneAndUpdate(
      { cafeId: req.params.id },
      req.body,
      { new: true }
    );
    if (!cafe) return res.status(404).json({ error: "Cafe not found" }); // Handle cafe not found
    res.json(cafe); // Respond with the updated cafe
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Delete a cafe
const deleteCafe = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find and delete the cafe
    const cafe = await Cafe.findOneAndDelete(
      { cafeId: req.params.id },
      { session }
    );
    if (!cafe) return res.status(404).json({ error: "Cafe not found" }); // Handle cafe not found

    // Use aggregation to find all employees associated with the cafe
    const associatedEmployees = await Employee.aggregate([
      {
        $lookup: {
          from: "employeecafeassignments", // Collection name in MongoDB
          localField: "employeeId",
          foreignField: "employeeId",
          as: "assignments",
        },
      },
      {
        $match: {
          "assignments.cafeId": cafe.cafeId,
        },
      },
    ]);

    const employeeIds = associatedEmployees.map(
      (employee) => employee.employeeId
    );

    // Delete any employees and their assignments related to the cafe
    if (employeeIds.length > 0) {
      await Employee.deleteMany(
        { employeeId: { $in: employeeIds } },
        { session }
      );
      await EmployeeCafeAssignment.deleteMany(
        { employeeId: { $in: employeeIds } },
        { session }
      );
    }

    // Delete the logo file from GridFS if it exists
    if (cafe && cafe.logo) {
      const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
      await bucket.delete(new mongoose.Types.ObjectId(cafe.logo)); // Remove logo file
    }

    await session.commitTransaction(); // Commit the transaction
    session.endSession();
    res.json({ message: "Cafe and associated employees deleted" }); // Respond with success message
  } catch (error) {
    await session.abortTransaction(); // Rollback if error occurs
    session.endSession();
    res.status(500).json({ error: error.message }); // Handle errors
  }
};

// Get cafe image
const getCafeImage = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id); // Get file ID from request
    const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    const downloadStream = bucket.openDownloadStream(fileId); // Create download stream for the file

    // Handle download stream errors
    downloadStream.on("error", (error) => {
      console.error("Error during download stream:", error);
      res.status(404).send({ error: "Image not found" }); // Respond if image not found
    });

    // Pipe the download stream to the response
    downloadStream.pipe(res).on("finish", () => {
      console.log("Image fetch completed"); // Log completion
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send({ error: "Failed to fetch image" }); // Handle errors
  }
};

// Export controller functions for use in routes
module.exports = {
  getAllCafes,
  createCafe,
  updateCafe,
  deleteCafe,
  getCafeImage,
};
