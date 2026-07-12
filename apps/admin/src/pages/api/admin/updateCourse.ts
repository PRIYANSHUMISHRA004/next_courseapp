

import type { NextApiRequest, NextApiResponse } from "next";
import { Admin, Course, connectDB } from "db";
import { verifyToken } from "auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const adminData = verifyToken(req, process.env.ADMIN_SECRET!);

    const admin = await Admin.findOne({
      username: adminData.username,
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const { courseId, title, description, imageLink, price, published } = req.body;
console.log("Admin ID:", admin._id);
console.log("Course ID:", courseId);
const existingCourse = await Course.findById(courseId);
console.log(existingCourse);
console.log(existingCourse?.adminId);
console.log(admin._id);
    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        adminId: admin._id,
      },
      {
        $set: {
          title,
          description,
          imageLink,
          price,
          published,
        },
      },
      {
        new: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found or not owned by admin",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}