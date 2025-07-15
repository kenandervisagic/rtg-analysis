import {useRef, useState, useCallback} from "react";
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

export interface ResultData {
    diagnosis: string;
    confidence: number; // 0-100 %
    insights: string[];
    imageUrl: string;
}

interface UploadSectionProps {
    onResult: (result: ResultData) => void;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || ""; // empty string means relative URL

const UploadSection = ({onResult}: UploadSectionProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const reset = useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
        setLoading(false);
        setProgress(0);
        setError(null);
    }, [previewUrl]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
                setError("Unsupported file format. Please upload JPG or PNG images.");
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setError(null);
        if (event.dataTransfer.files.length > 0) {
            const droppedFile = event.dataTransfer.files[0];
            if (["image/jpeg", "image/png", "image/jpg"].includes(droppedFile.type)) {
                setFile(droppedFile);
                setPreviewUrl(URL.createObjectURL(droppedFile));
            } else {
                setError("Unsupported file format. Please upload JPG or PNG images.");
            }
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select an image file first.");
            return;
        }
        setLoading(true);
        setProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(baseURL + "/api/predict", formData, {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (e) => {
                    if (e.total) {
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            const data: ResultData = {
                diagnosis: response.data.result,
                confidence: Math.round(response.data.confidence * 100), // convert 0-1 to 0-100%
                insights:
                    response.data.result === "PNEUMONIA"
                        ? ["Bilateral pneumonia with visible consolidation"]
                        : ["No signs of pneumonia detected."],
                imageUrl: previewUrl!,
            };

            onResult(data);
            reset();
        } catch (uploadError) {
            setError("Upload failed. Please try again.");
            console.error("Upload error:", uploadError);
            setLoading(false);
            setProgress(0);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <Paper
            elevation={4}
            sx={{
                padding: 4,
                borderRadius: 4,
                backgroundColor: "#ffffff",
                userSelect: "none",
            }}
        >
            <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
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
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": {borderColor: "#90a4ae"},
                    }}
                >
                    <CloudUploadIcon sx={{fontSize: 50, color: "#1565c0"}}/>
                    <Typography variant="body1" color="#1565c0" mt={1} textAlign="center">
                        Drag & Drop or Click to upload your chest X-ray (JPG, PNG, JPEG)
                    </Typography>
                </Box>
            )}

            {previewUrl && (
                <Box mb={3} textAlign="center" position="relative">
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
                    <Button
                        size="small"
                        color="error"
                        sx={{position: "absolute", top: 8, right: 8}}
                        onClick={reset}
                    >
                        Remove
                    </Button>
                </Box>
            )}

            {loading && (
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <CircularProgress size={48} color="primary"/>
                    <Typography mt={2} color="text.secondary">
                        Analyzing X-ray...
                    </Typography>
                    <Box width="100%" mt={2}>
                        <LinearProgress variant="determinate" value={progress}/>
                    </Box>
                </Box>
            )}

            {error && (
                <Typography color="error" variant="body2" mb={2} textAlign="center">
                    {error}
                </Typography>
            )}

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#1565c0">
                    Upload Guidelines
                </Typography>

                <Stack spacing={1.5}>
                    {[
                        "Image formats: JPEG, PNG, JPG",
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
                                <CheckCircleIcon sx={{color: "#81c784", fontSize: 18}}/>
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
                    onClick={file ? handleUpload : handleClick}
                    sx={{
                        backgroundColor: "#1565c0",
                        borderRadius: 50,
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {backgroundColor: "#0d47a1"},
                    }}
                    disabled={loading}
                >
                    {file ? "Analyze X-Ray" : "Upload X-Ray"}
                </Button>
            </Box>
        </Paper>
    );
};

export default UploadSection;
