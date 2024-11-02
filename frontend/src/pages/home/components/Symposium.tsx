// ... (previous imports remain the same)
import { NavigateBefore, NavigateNext, PlayCircle } from "@mui/icons-material";
import { Box, Card, Container, IconButton, Typography } from "@mui/material";

const Symposium = () => {
  // Previous Symposiums data with YouTube links
  const previousSymposiums = [
    {
      year: "2021",
      youtubeId: "LE1fljBlE-w",
      title: "BISS 2021 Highlights",
    },
    {
      year: "2020",
      youtubeId: "H7FEN-wDnFo",
      title: "BISS 2020 Highlights",
    },
  ];

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Function to open YouTube video
  const openYouTubeVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <Box>
      <Box className="flex flex-col md:flex-row justify-center gap-6">
        {previousSymposiums.map((symposium) => (
          <Card
            key={symposium.year}
            className="w-full  cursor-pointer transform transition-transform "
            onClick={() => openYouTubeVideo(symposium.youtubeId)}
            sx={{ borderRadius: 3 }}
          >
            <Box className="relative">
              <img
                src={getYouTubeThumbnail(symposium.youtubeId)}
                alt={`BISS ${symposium.year}`}
                className="w-full aspect-video object-cover"
              />
              <Box className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                <PlayCircle sx={{ fontSize: 60 }} className="text-white" />
              </Box>
              <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <Typography variant="h6" className="text-white text-center">
                  BISS {symposium.year}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Symposium;
