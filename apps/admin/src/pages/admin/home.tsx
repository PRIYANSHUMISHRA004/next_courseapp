// import React from "react";
// import { useRecoilValue } from "recoil";
// import { adminState } from "store";
// import SignupPage from "./signup";
// import {
//   Container,
//   Stack,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Divider,
//   CircularProgress,
//   Box,
// } from "@mui/material";

// export default function Home() {
//   const admin = useRecoilValue(adminState);

//   // TODO: Replace with existing courses array
//   const courses: any[] = []; 

//   if (admin.isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (admin.userName === null) {
//     return <SignupPage />;
//   }

//   return (
//     <Container maxWidth="md">
//       <Stack spacing={4} sx={{ py: 4 }}>
//         {/* Welcome Section */}
//         <Typography variant="h4">
//           Welcome back, {admin.userName || "Admin"} 👋
//         </Typography>

//         <Divider />

//         {/* My Courses Section */}
//         <Stack spacing={2}>
//           <Typography variant="h5">My Courses</Typography>
//           <Typography variant="body1">
//             Total Courses: {courses.length}
//           </Typography>

//           {/* Empty State */}
//           {courses.length === 0 && (
//             <Card variant="outlined">
//               <CardContent>
//                 <Stack spacing={2} alignItems="flex-start">
//                   <Typography variant="body1">
//                     You haven't created any courses yet.
//                   </Typography>
//                   <Button variant="contained" onClick={() => {}}>
//                     Create your first course.
//                   </Button>
//                 </Stack>
//               </CardContent>
//             </Card>
//           )}
//         </Stack>

//         <Divider />

//         {/* Quick Actions */}
//         <Stack spacing={2}>
//           <Typography variant="h5">Quick Actions</Typography>
//           <Grid container spacing={3}>
//             {/* Action 1 */}
//             <Grid size={{ xs: 12, sm: 4 }}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Stack spacing={2}>
//                     <Typography variant="h6">View All Courses</Typography>
//                     <Button variant="outlined" onClick={() => {}}>
//                       View Courses
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Action 2 */}
//             <Grid size={{ xs: 12, sm: 4 }}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Stack spacing={2}>
//                     <Typography variant="h6">Add New Course</Typography>
//                     <Button variant="outlined" onClick={() => {}}>
//                       Add Course
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Action 3 */}
//             <Grid size={{ xs: 12, sm: 4 }}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Stack spacing={2}>
//                     <Typography variant="h6">Manage Courses</Typography>
//                     <Button variant="outlined" onClick={() => {}}>
//                       Manage
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Stack>
//       </Stack>
//     </Container>
//   );
// }