import { Button, Card, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CourseFormat } from "store";

export default function Course() {
  const router = useRouter();
  const { id } = router.query;

  const [course, setCourse] = useState<CourseFormat | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;

      try {
        const res = await axios.get(`/api/user/courses?id=${id}`);

        setCourse(res.data.course);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          padding: 3,
        }}
      >
        <img
          src={course.imageLink}
          alt={course.title}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 10,
            marginBottom: 20,
          }}
        />

        <Typography variant="h4" textAlign="center" gutterBottom>
          {course.title}
        </Typography>

        <Typography variant="h6" textAlign="center">
          ₹{course.price}
        </Typography>

        <Typography sx={{ marginTop: 3 }}>
          {course.description}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 4 }}
          onClick={async () => {
            try {
              const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

              if (!token) {
                alert("Please login first");
                router.push("/user/login");
                return;
              }

              const orderRes = await axios.post(
                "/api/payment/create-order",
                {
                  courseId: id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              const { orderId, amount, currency } = orderRes.data;

              const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

              if (!razorpayKey) {
                alert("Razorpay key is missing");
                return;
              }

              const options = {
                key: razorpayKey,
                amount,
                currency,
                name: "Course Selling App",
                description: course.title,
                order_id: orderId,
                handler: async function (response: any) {
                  await axios.post(
                    "/api/payment/verify-payment",
                    {
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                      courseId: id,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  alert("Course purchased successfully");
                  router.push("/user/mycourses");
                },
                modal: {
                  ondismiss: function () {
                    alert("Payment cancelled");
                  },
                },
              };

              const razorpay = new (window as any).Razorpay(options);

              razorpay.on("payment.failed", function (response: any) {
                const error = response?.error;
                const message = [
                  error?.description || "Payment failed",
                  error?.code ? `Code: ${error.code}` : "",
                  error?.reason ? `Reason: ${error.reason}` : "",
                ]
                  .filter(Boolean)
                  .join("\n");

                alert(message);
              });

              razorpay.open();
            } catch (err: any) {
              alert(err?.response?.data?.message || "Unable to purchase course");
            }
          }}
        >
          Purchase Course
        </Button>
      </Card>
    </div>
  );
}
