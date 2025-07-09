import {Avatar, Box, Button, Paper, Stack, Typography} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const UploadSection = () => (
    <Paper
        elevation={3}
        style={{
            padding: 32,
            borderRadius: 16,
            backgroundColor: '#ffffff',
        }}
    >
        {/* Upload Drop Zone */}
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            border="2px dashed #b0bec5"
            borderRadius="10%"
            width={300}
            height={200}
            margin="0 auto"
            mb={3}
            sx={{cursor: 'pointer', transition: '0.3s', '&:hover': {borderColor: '#90a4ae'}}}
        >
            <CloudUploadIcon sx={{fontSize: 50, color: '#1565c0'}}/>
            <Typography variant="body1" color="#1565c0" mt={1}>
                Upload Image
            </Typography>
        </Box>

        {/* Hint Text */}
        <Typography variant="body2" color="textSecondary" align="center" mb={3}>
            Drag & drop or click to select your chest X-ray (JPG, PNG)
        </Typography>

        {/* Upload Guidelines */}
        <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#1565c0">
                Upload Guidelines
            </Typography>

            <Stack spacing={1.5}>
                {[
                    "Image formats: JPEG, PNG",
                    "Minimum resolution: 512×512 px",
                    "Ensure a clear, unobstructed chest view"
                ].map((text, index) => (
                    <Box key={index} display="flex" alignItems="center">
                        <Avatar
                            sx={{
                                bgcolor: '#e8f5e9',
                                width: 23,
                                height: 23,
                                mr: 1
                            }}
                        >
                            <CheckCircleIcon sx={{color: '#81c784', fontSize: 18}}/>
                        </Avatar>
                        <Typography variant="body2" color="text.primary">
                            {text}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>

        {/* Analyze Button */}
        <Box mt={4} textAlign="center">
            <Button
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: '#1565c0',
                    borderRadius: 50,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {backgroundColor: '#0d47a1'}
                }}
            >
                Analyze X-Ray
            </Button>
        </Box>
    </Paper>
);

export default UploadSection;