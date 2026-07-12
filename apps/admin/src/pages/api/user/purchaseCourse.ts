

import type { NextApiRequest, NextApiResponse } from "next";
import { User, Course, connectDB } from "db";
import { verifyToken } from "auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const userData = verifyToken(req, process.env.USER_SECRET!);

    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const user = await User.findOne({
      username: userData.username,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyPurchased = user.courses.some(
      (id:any) => id.toString() === courseId
    );

    if (alreadyPurchased) {
      return res.status(400).json({
        message: "Course already purchased",
      });
    }

    user.courses.push(course._id);
    await user.save();

    return res.status(200).json({
      message: "Course purchased successfully",
    });
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}