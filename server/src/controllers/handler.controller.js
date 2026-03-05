const Display = require("../models/Display.model");
const mongoose = require("mongoose");

async function handleCreateDisplay(req, res) {
  const userID = req.user?.userId;
  const { name, description, hardwareID } = req.body;

  if (!name || !description || !hardwareID) {
    return res.status(400).json({
      message: "Missing required fields: name, description, and hardwareID.",
    });
  }

  if (!userID) {
    return res.status(401).json({
      message:
        "Authentication required. You cannot create a display without a user.",
    });
  }

  try {
    const existingDisplay = await Display.findOne({ hardwareID });

    if (existingDisplay) {
      return res
        .status(409)
        .json({ message: "A display with this hardware ID already exists." });
    }

    const newDisplay = new Display({
      userID,
      hardwareID,
      name,
      description,
      firstline: "Zyrex Robotics",
      firstlineScroll: false,
      secondline: "Please enter the text to be displayed",
      secondlineScroll: true,
      isDataChanged:true
    });

    const savedDisplay = await newDisplay.save();

    res.status(201).json({
      message: "Display created successfully.",
      display: savedDisplay,
    });
  } catch (error) {
    console.error("Error creating display:", error);

    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "A display with this hardware ID already exists." });
    }

    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleUpdateDisplay(req, res) {
  const { id } = req.params;
  const { firstline, firstlineScroll, secondline, secondlineScroll } = req.body;
  const userID = req.user?.userId;

  if (!id) return res.status(400).json({ message: "missing field or id" });

  try {
    const display = await Display.findById(id);
    if (!display) {
      return res.status(404).json({ error: "Display not found" });
    }

    if (display.userID !== userID) {
      return res.status(401).json({ message: "Access Denied !" });
    }

    display.firstline = firstline || display.firstline;
    display.isDataChanged = true;
    display.firstlineScroll =
      firstlineScroll !== undefined ? firstlineScroll : display.firstlineScroll;
    display.secondline = secondline || display.secondline;
    display.secondlineScroll =
      secondlineScroll !== undefined
        ? secondlineScroll
        : display.secondlineScroll;

    await display.save();
    if (!display)
      return res
        .status(500)
        .json({ message: "Error occured while updating Display" });
    res.status(200).json({ message: "Display updated successfully", display });
  } catch (error) {
    console.error("Error updating display:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleDeleteDisplay(req, res) {
  try {
    const { id } = req.params;
    const userID = req.user?.userId;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "A valid Display ID is required." });
    }

    const display = await Display.findById(id);

    if (!display) {
      return res.status(404).json({ message: "Display not found." });
    }

    if (display.userID.toString() !== userID) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this display." });
    }

    const deletedDisplay = await Display.findByIdAndDelete(id);

    res.status(200).json({
      message: "Display deleted successfully.",
      display: deletedDisplay,
    });
  } catch (error) {
    console.error("Error deleting display:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// async function handleGetDisplay(req, res) {
//   try {
//     const { hardwareID } = req.params;

//     if (!hardwareID) {
//       return res.status(400).json({ message: "Hardware ID is required." });
//     }

//     const displayInfo = await Display.findOne({ hardwareID });

//     if (!displayInfo) {
//       return res
//         .status(404)
//         .json({ message: "Display not found with the provided Hardware ID." });
//     }

//     // Store the previous state of isDataChanged
//     const previousIsDataChanged = displayInfo.isDataChanged;

//     // Now set it to false
//     displayInfo.isDataChanged = false;
//     await displayInfo.save();

//     res.status(200).json({
//       message: "Display data retrieved successfully.",
//       display: displayInfo,
//       previousIsDataChanged, // send previous state back
//     });
//   } catch (error) {
//     console.error("Error fetching display:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }




async function handleGetDisplay(req, res) {
  try {
    const { hardwareID } = req.params;

    if (!hardwareID) {
      return res.status(400).json({ message: "Hardware ID is required." });
    }

    const displayInfo = await Display.findOneAndUpdate(
      { hardwareID },
      { $set: { isDataChanged: false } },
      { new: false } // return document BEFORE update
    ).lean();

    if (!displayInfo) {
      return res
        .status(404)
        .json({ message: "Display not found with the provided Hardware ID." });
    }

    res.status(200).json({
      message: "Display data retrieved successfully.",
      display: displayInfo,
      previousIsDataChanged: displayInfo.isDataChanged,
    });

  } catch (error) {
    console.error("Error fetching display:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  handleCreateDisplay,
  handleUpdateDisplay,
  handleDeleteDisplay,
  handleGetDisplay,
};
