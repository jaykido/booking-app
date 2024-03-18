import express, { Request, Response } from "express";
import cloudinary from "cloudinary";
import multer from "multer";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // -> 5MB
  },
});
// api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is Required"),
    body("city").notEmpty().withMessage("City is Required"),
    body("country").notEmpty().withMessage("Country is Required"),
    body("description").notEmpty().withMessage("Description is Required"),
    body("type").notEmpty().withMessage("Hotel type is Required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is Required (Number)"),
    body("facilites")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are Required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    console.log("The request for your own sanity: ", req);
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //   1. Upload Images to Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64" + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      //  2. If the Upload was successful, add the urls to the new hotel
      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //   3. Save the new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //   4. return a 201 status
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error Creating hotels: ", error);
      res.status(500).json({ message: "Something Went wrong" });
    }
  }
);

export default router;