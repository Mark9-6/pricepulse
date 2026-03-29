import Competitor from "../models/Competitor.js";

export const createCompetitor = async (req, res) => {
  try {
    console.log("BODY:", req.body); // DEBUG

    const competitor = await Competitor.create(req.body);

    res.json(competitor);
  } catch (error) {
    console.error("ERROR:", error); // 👈 THIS LINE

    res.status(500).json({
      message: "Error creating competitor",
      error: error.message   // 👈 SHOW REAL ERROR
    });
  }
};

export const getCompetitors = async (req, res) => {
  try {
    const competitors = await Competitor.find();
    res.json(competitors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching competitors" });
  }
};