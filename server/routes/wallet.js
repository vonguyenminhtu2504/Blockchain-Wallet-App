const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const Wallet = require("../models/Wallet");

// @route GET api/wallets
// @balance Get posts
// @access Private

router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Wallet.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

// @route POST api/wallets
// @balance Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { name, balance, url, status } = req.body;

  //Simple validation

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required!" });
  }

  try {
    const newPost = new Wallet({
      name: name,
      balance: balance,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });

    await newPost.save();

    return res
      .status(200)
      .json({ success: true, message: "Happy Learning!", post: newPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

// @route PUT api/wallets
// @balance Update posts
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { name, balance, url, status } = req.body;

  // Simple validation
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required!" });
  }

  try {
    let updatedPost = {
      name,
      balance: balance || "",
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || 'Active',
    };
    const updatePostCondition = { _id: req.params.id, user: req.userId };
    updatedPost = await Wallet.findOneAndUpdate(
      updatePostCondition,
      updatedPost,
      { new: true }
    );

    // Post not found or user is not authorized to update the post
    if (!updatedPost) {
      return res.status(400).json({
        success: false,
        message:
          "Post not found or user is not authorized to update this post!",
      });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Excellent progress!",
        post: updatedPost,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

// @route DELETE api/wallets
// @balance Delete post
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletePostCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Wallet.findOneAndDelete(deletePostCondition);

    // Post not found or user is not authorized to delete the post
    if (!deletedPost) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Post not found or user is not authorized to delete the post!",
        });
    }
    return res.status(200).json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;
