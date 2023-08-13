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
    res.status(201).json({
      status: "success",
      message: "Music shared successfully",
      data: {
        share: newShare,
      },
    });
  } catch (error) {
    res.status(500).json({
      stauts: "error",
      message: `Error sharing the music:\n${error.messag}`,
    });
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
    res.status(500).json({
      stauts: "error",
      message: `Error fetching shared music:\n${error.message}`,
    });
  }
};

exports.getSpecificShare = async (req, res) => {
  try {
    const shareId = req.params.id;
    const share = await MusicShare.findById(shareId).populate("music");

    if (!share) {
      return res.status(404).json({
        status: "fail",
        message: "Share not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        share,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error fetching the specific share:\n${error.message}`,
    });
  }
};
