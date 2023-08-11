const MusicShare = require("../models/MusicShare");

exports.shareMusic = async (req, res) => {
  try {
    const { sender, receiver, music, message } = req.body;

    const newShare = new MusicShare({
      sender,
      receiver,
      music,
      message,
    });

    await newShare.save();
    res
      .status(201)
      .json({ message: "Music shared successfully", share: newShare });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sharing the music", error: error.message });
  }
};

exports.getReceivedShares = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you store logged in user's id in req.user.id
    const receivedShares = await MusicShare.find({ receiver: userId }).populate(
      "music"
    );

    res.status(200).json({ receivedShares });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching shared music", error: error.message });
  }
};

exports.getSpecificShare = async (req, res) => {
  try {
    const shareId = req.params.id;
    const share = await MusicShare.findById(shareId).populate("music");

    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }

    res.status(200).json({ share });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the specific share",
      error: error.message,
    });
  }
};
