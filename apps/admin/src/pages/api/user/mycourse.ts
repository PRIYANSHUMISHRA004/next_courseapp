

import type { NextApiRequest, NextApiResponse } from "next";
import { User, connectDB } from "db";
import { verifyToken } from "auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const userData = verifyToken(req, process.env.USER_SECRET!);

    const user = await User.findOne({
      username: userData.username,
    }).populate("courses");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses: user.courses,
    });
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}