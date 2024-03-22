import express, { Request, Response } from "express";
// import cloudinary from "cloudinary";
// import multer from "multer";
import Hotel from "../models/hotel";
// import verifyToken from "../middleware/auth";
import { HotelSearchResponse } from "../shared/types";
// import { body } from "express-validator";
// import { HotelType } from "../shared/types";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize;
    const hotels = await Hotel.find().skip(skip).limit(pageSize);

    const total = await Hotel.countDocuments();

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    const hotels = await Hotel.find();
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
