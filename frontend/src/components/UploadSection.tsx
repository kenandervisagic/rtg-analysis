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
    setCurrentStep: (step: string) => void;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || ""; // empty string means relative URL

const UploadSection = ({ onResult, setCurrentStep }: UploadSectionProps) => {
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
            setCurrentStep("Results");

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
            elevation={8}
            sx={{
                padding: 4,
                borderRadius: 6,
                backgroundColor: "#0f172a", // dark navy
                userSelect: "none",
                margin: "0 auto",
                boxShadow: "0 0 24px rgba(100,116,139,0.1)",
                border: "1px solid #1e293b",
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
                    border="2px dashed #6366f1"
                    borderRadius={5}
                    width="100%"
                    height={280}
                    margin="0 auto"
                    mb={3}
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        cursor: "pointer",
                        backgroundColor: "#1e293b",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            borderColor: "#7c3aed",
                            backgroundColor: "#1f2a3c",
                            boxShadow: "0 0 10px rgba(124,58,237,0.3)",
                        },
                    }}
                >
                    <Typography variant="h6" color="#cbd5e1" mb={1}>
                        Add an X-ray file
                    </Typography>

                    <Typography variant="body2" color="#64748b" mb={2}>
                        Allowed formats: DICOM, PDF, PNG, JPEG.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon/>}
                        sx={{
                            background: "linear-gradient(90deg, #6366f1, #7c3aed)",
                            borderRadius: "9999px",
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                            textTransform: "none",
                            boxShadow: "0 0 10px rgba(124,58,237,0.3)",
                            "&:hover": {
                                background: "linear-gradient(90deg, #7c3aed, #6366f1)",
                                boxShadow: "0 0 14px rgba(124,58,237,0.5)",
                            },
                        }}
                    >
                        Add file
                    </Button>
                </Box>
            )}

            {previewUrl && (
                <Box mb={3} textAlign="center" position="relative">
                    <img
                        src={previewUrl}
                        alt="X-ray preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: 280,
                            borderRadius: 12,
                            border: "1px solid #334155",
                        }}
                    />
                    <Button
                        size="small"
                        color="error"
                        sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            backgroundColor: "#ef4444",
                            "&:hover": {backgroundColor: "#dc2626"},
                        }}
                        onClick={reset}
                    >
                        Remove
                    </Button>
                </Box>
            )}

            {loading && (
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <CircularProgress size={48} sx={{color: "#6366f1"}}/>
                    <Typography mt={2} color="#cbd5e1">
                        Analyzing X-ray...
                    </Typography>
                    <Box width="100%" mt={2}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                backgroundColor: "#334155",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#7c3aed",
                                },
                            }}
                        />
                    </Box>
                </Box>
            )}

            {error && (
                <Typography color="#ef4444" variant="body2" mb={2} textAlign="center">
                    {error}
                </Typography>
            )}

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#7c3aed">
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
                                    bgcolor: "#1e293b",
                                    width: 24,
                                    height: 24,
                                    mr: 1,
                                    border: "1px solid #334155",
                                }}
                            >
                                <CheckCircleIcon sx={{color: "#10b981", fontSize: 20}}/>
                            </Avatar>
                            <Typography variant="body2" color="#cbd5e1">
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
                        background: "linear-gradient(90deg, #6366f1, #7c3aed)",
                        borderRadius: "9999px",
                        py: 1.5,
                        fontWeight: "bold",
                        textTransform: "none",
                        color: "#f8fafc",
                        "&:hover": {
                            background: "linear-gradient(90deg, #7c3aed, #6366f1)",
                            boxShadow: "0 0 14px rgba(124,58,237,0.4)",
                        },
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
