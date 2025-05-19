const cloudinary = require("../utils/cloudinary");

const getWhoWeAreImages = async (req, res) => {
  try {
    const resources = await cloudinary.search
      .expression('folder:whoWeAre')
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    res.json(resources.resources.map(img => ({
      url: img.secure_url,
      alt: img.public_id
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
  }
};

module.exports = { getWhoWeAreImages };
