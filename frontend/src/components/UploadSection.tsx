// UploadSection.tsx
import { useRef, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography,
    LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

interface UploadSectionProps {
    onSuccess: (imageUrl: string) => void;
}

const UploadSection = ({ onSuccess }: UploadSectionProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setProgress(0);
        const formData = new FormData();
        formData.append("image", file);

        try {
            // Simulate upload via mock endpoint - replace this with your real API call
            await axios.post("http://localhost:8000/api/health", formData, {
                onUploadProgress: (e) => {
                    if (e.total) {
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });
            await new Promise((res) => setTimeout(res, 600)); // fake delay
            setUploaded(true);
            if (previewUrl) onSuccess(previewUrl);
        } catch (err) {
            setError("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => inputRef.current?.click();

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height={300}
            >
                <CircularProgress size={48} color="primary" />
                <Typography mt={2} color="text.secondary">
                    Analyzing X-ray...
                </Typography>
                <Box width="100%" mt={2}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            </Box>
        );
    }

    if (uploaded) {
        return (
            <Box textAlign="center">
                <Typography variant="h6" color="primary">
                    Upload complete!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Your results are now available.
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={4}
            sx={{
                padding: 4,
                borderRadius: 4,
                backgroundColor: "#ffffff",
            }}
        >
            <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                ref={inputRef}
                onChange={handleFileSelect}
            />

            {!previewUrl && (
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
                    onClick={handleClick}
                    sx={{
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": { borderColor: "#90a4ae" },
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 50, color: "#1565c0" }} />
                    <Typography variant="body1" color="#1565c0" mt={1}>
                        Upload Image
                    </Typography>
                </Box>
            )}

            {previewUrl && (
                <Box mb={3} textAlign="center">
                    <img
                        src={previewUrl}
                        alt="X-ray preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: 200,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                        }}
                    />
                </Box>
            )}

            {!previewUrl && (
                <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                    Drag & drop or click to select your chest X-ray (JPG, PNG)
                </Typography>
            )}

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#1565c0">
                    Upload Guidelines
                </Typography>

                <Stack spacing={1.5}>
                    {[
                        "Image formats: JPEG, PNG",
                        "Minimum resolution: 512×512 px",
                        "Ensure a clear, unobstructed chest view",
                    ].map((text, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <Avatar
                                sx={{
                                    bgcolor: "#e8f5e9",
                                    width: 23,
                                    height: 23,
                                    mr: 1,
                                }}
                            >
                                <CheckCircleIcon sx={{ color: "#81c784", fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="body2" color="text.primary">
                                {text}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            <Box mt={4} textAlign="center">
                <Button
                    variant="contained"
                    fullWidth
                    onClick={previewUrl ? handleUpload : handleClick}
                    sx={{
                        backgroundColor: "#1565c0",
                        borderRadius: 50,
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#0d47a1" },
                    }}
                >
                    {previewUrl ? "Analyze X-Ray" : "Upload X-Ray"}
                </Button>
            </Box>
        </Paper>
    );
};

export default UploadSection;
