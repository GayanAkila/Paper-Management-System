import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  alpha,
  Typography,
} from "@mui/material";
import React from "react";
import HomeHeader from "./components/HomeHeader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import framesImage from "../../assets/images/frame.png";
import {
  ExpandMore,
  Add,
  NavigateBefore,
  NavigateNext,
  Facebook,
  LinkedIn,
} from "@mui/icons-material";
import Symposium from "./components/Symposium";

const Home = () => {
  return (
    <Stack
      height={"100%"}
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    >
      <HomeHeader />
      {/* Hero Section */}
      <Container sx={{ mt: 14 }}>
        <Box
          className=" p-10 flex items-center"
          sx={{
            background: `url(${framesImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 6,
          }}
        >
          <Box className="flex-1">
            <Typography
              variant="h4"
              component="h1"
              className="font-bold mb-4"
              width={"60%"}
            >
              Welcome to Business Information Systems Student Symposium 2024.
            </Typography>
            <Typography className="mb-4" sx={{ mb: 1 }}>
              Don't miss your chance to present, learn, and connect. Secure your
              spot today!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{borderRadius: 24}}
            >
              Register Now
            </Button>
            <Box
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
              sx={{
                p: 2,
                backgroundColor: (theme) =>
                  alpha(theme.palette.background.default, 0.6),
                backdropFilter: "blur(10px)",
                borderRadius: 6,
              }}
            >
              <Box className="flex items-center">
                <Box
                  display={"flex"}
                  height={"100%"}
                  width={"100%"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#F6F9FE",
                    color: "#143559",
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 60 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Event Date
                    </Typography>
                    <Typography variant="body2">February 28, 2024</Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="flex items-center">
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={"100%"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#F6F9FE",
                    color: "#143559",
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 60 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Event Location
                    </Typography>
                    <Typography variant="body2">
                      Fayol Hall, FMSC, USJ
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="flex items-center">
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={"100%"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#F6F9FE",
                    color: "#143559",
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 60 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Call Us
                    </Typography>
                    <Typography variant="body2">+94 11 280 2069</Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="flex items-center">
                <Box
                  display={"flex"}
                  width={"100%"}
                  height={"100%"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#F6F9FE",
                    color: "#143559",
                  }}
                >
                  <EmailIcon sx={{ fontSize: 60 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      it@sjp.ac.lk
                    </Typography>
                    <Typography variant="body2">+94 11 280 2069</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* About*/}
      <Container className="mt-10">
        <Card
          className="  flex items-center justify-space-between p-6"
          elevation={0}
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: 6,
            height: "auto",
          }}
        >
          <CardContent className="flex flex-col md:flex-row items-center ">
            <Box
              height={"100%"}
              width={300}
              className="mr-8"
              component={"img"}
              src={require("../../assets/images/pic.jpg")}
              alt="BIS"
              sx={{ borderRadius: 3 }}
            />

            <Box
              className="flex flex-col p-8 justify-center items-start"
              height={300}
              sx={{
                borderRadius: 3,
                backgroundColor: (theme) =>
                  theme.palette.background.lightBackground,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                className="font-bold mb-4"
              >
                About BISSS
              </Typography>
              <Typography>
                The event is organized with the objective of providing the
                students a platform to engage, showcase and contemplate on the
                more socially conscious and applied perspectives of Information
                Technology and Business education.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 3, borderRadius: 24 }}
              >
                Read More
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      {/* Event Schedule */}
      <Container className="mt-10">
        <Box
          className=" p-10"
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: 6,
            height: "auto",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            className="font-bold "
            sx={{ mb: 2 }}
          >
            Event Schedule
          </Typography>
          <Box
            className="p-8"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.background.lightBackground,
              borderRadius: 4,
            }}
          >
            <Accordion
              defaultExpanded
              disableGutters
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Add
                    sx={{
                      color: (theme) => theme.palette.background.icon,
                    }}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography variant="h4" fontSize={24} fontWeight={500}>
                  Common Session 01
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-2">
                  <Typography>
                    12:45 pm - 01:00 pm: Arrival of Guests and Registration
                  </Typography>
                  <Typography>
                    01:00 pm - 01:05 pm: Commencing the Event
                  </Typography>
                  <Typography>01:05 pm - 01:15 pm: Welcome Speech</Typography>
                  {/* Add other schedule items */}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Add
                    sx={{
                      color: (theme) => theme.palette.background.icon,
                    }}
                  />
                }
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography variant="h4" fontSize={24} fontWeight={500}>
                  Parallel Session 01
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-2">
                  <Typography>
                    12:45 pm - 01:00 pm: Arrival of Guests and Registration
                  </Typography>
                  <Typography>
                    01:00 pm - 01:05 pm: Commencing the Event
                  </Typography>
                  <Typography>01:05 pm - 01:15 pm: Welcome Speech</Typography>
                  {/* Add other schedule items */}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Add
                    sx={{
                      color: (theme) => theme.palette.background.icon,
                    }}
                  />
                }
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography variant="h4" fontSize={24} fontWeight={500}>
                  Parallel Session 02
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-2">
                  <Typography>
                    12:45 pm - 01:00 pm: Arrival of Guests and Registration
                  </Typography>
                  <Typography>
                    01:00 pm - 01:05 pm: Commencing the Event
                  </Typography>
                  <Typography>01:05 pm - 01:15 pm: Welcome Speech</Typography>
                  {/* Add other schedule items */}
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 1,
                backgroundColor: (theme) => theme.palette.background.default,
                overflow: "hidden",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Add
                    sx={{
                      color: (theme) => theme.palette.background.icon,
                    }}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography variant="h4" fontSize={24} fontWeight={500}>
                  Common Session 02
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-2">
                  <Typography>
                    12:45 pm - 01:00 pm: Arrival of Guests and Registration
                  </Typography>
                  <Typography>
                    01:00 pm - 01:05 pm: Commencing the Event
                  </Typography>
                  <Typography>01:05 pm - 01:15 pm: Welcome Speech</Typography>
                  {/* Add other schedule items */}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Container>
      {/* Guest Speakers */}
      <Container className="mt-10">
        <Box
          className=" p-10"
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: 6,
            height: "auto",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            className="font-bold"
            sx={{ mb: 2 }}
          >
            Guest Speakers
          </Typography>
          <Box className="grid grid-cols-[2fr_12fr] justify-space-between mb-4 gap-3 ">
            <Box
              sx={{
                width: 150,
                borderRadius: 2,
                aspectRatio: "1 / 1",
              }}
              component={"img"}
              src={require("../../assets/images/person1.jpg")}
              alt="person1"
            />
            <Card
              className="flex p-4 items-center "
              elevation={0}
              sx={{ borderRadius: 2 }}
            >
              <CardContent className="flex items-center align-center ">
                <Box>
                  <Typography variant="h6" fontSize={32} fontWeight={500}>
                    Keynote Speaker 01 - Dr. Shalinka Jayatilleke
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Lecturer in Data Analytics and Artificial Intelligence, La
                    Trobe Business School
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box className="grid grid-cols-[12fr_2fr] justify-space-between mb-4 gap-3 ">
            <Card
              className="flex p-4 items-center "
              elevation={0}
              sx={{ borderRadius: 2 }}
            >
              <CardContent className="flex items-center align-center ">
                <Box>
                  <Typography variant="h6" fontSize={32} fontWeight={500}>
                    Keynote Speaker 01 - Dr. Shalinka Jayatilleke
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Lecturer in Data Analytics and Artificial Intelligence, La
                    Trobe Business School
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Box
              component={"img"}
              src={require("../../assets/images/person2.jpg")}
              alt="person1"
              sx={{
                width: 150,
                backgroundColor: "red",
                borderRadius: 2,
                aspectRatio: "1 / 1",
              }}
            />
          </Box>
        </Box>
      </Container>
      {/* Previous Symposiums */}
      <Container className="mt-10">
        <Box
          className=" p-10"
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: 6,
            height: "auto",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            className="font-bold"
            sx={{ mb: 3 }}
          >
            Previous Symposiums
          </Typography>
          <Symposium />
        </Box>
      </Container>
      {/* Footer */}

      <Container className="mt-10">
        <Box
          className=" pt-10 pr-10 pl-10 "
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: "48px 48px 0  0",
            height: "auto",
          }}
        >
          <Box className="grid grid-cols-1 md:grid-cols-3  gap-8 mb">
            <Box>
              <Typography variant="h5" fontWeight={600} mb={4}>
                Important Links
              </Typography>
              <Box className="space-y-2">
                <Typography>Research Area</Typography>
                <Typography>Faculty Home</Typography>
                <Typography>Examination Unit</Typography>
                <Typography>Libary</Typography>
                <Typography>LMS</Typography>
                <Typography>ITRC</Typography>
                <Typography>MYDIT</Typography>

                {/* Add other links */}
              </Box>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={600} mb={4}>
                Contact Us
              </Typography>
              <Box className="space-y-2">
                <Typography>
                  Department of Information Technology, Faculty of Management
                  Studies and Commerce Department of Information Technology
                </Typography>
                <Typography></Typography>
                <Typography>
                  University of Sri Jayewardenepura Gangodawila, Nugegoda 10250
                  Sri Lanka.
                </Typography>
                <Typography>
                  Phone: +94 112 802 069, Fax: +94 112 803653 Email:
                  office.it@sjp.ac.lk
                </Typography>
                {/* Add contact details */}
              </Box>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={600} mb={4}>
                Follow Us
              </Typography>
              <Facebook sx={{ fontSize: 60 }} />
              <LinkedIn sx={{ fontSize: 60 }} />
              <Divider sx={{ my: 1 }} />
              <Box
                component={"img"}
                src={require("../../assets/images/logo.png")}
                sx={{ width: 350 }}
              />
            </Box>
          </Box>
          <Divider sx={{ mt: 2 }} />
          <Box className="flex justify-center items-center p-4">
            <Typography>
              © 2024 Department of Information Technology - FMSC. All rights
              reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Stack>
  );
};

export default Home;
