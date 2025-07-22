import { useRef, useState, useCallback, useEffect } from "react";
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
import dicomParser from "dicom-parser";

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

const baseURL = import.meta.env.VITE_API_BASE_URL || ""; // prazno znači relativni URL

const acceptedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/dicom",
    "application/dicom+json",
    "application/dicom+xml",
];

const UploadSection = ({ onResult, setCurrentStep }: UploadSectionProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const dicomPreviewRef = useRef<HTMLDivElement>(null);

    const reset = useCallback(() => {
        setFile(null);
        setPreviewUrl(null);
        setLoading(false);
        setProgress(0);
        setError(null);
        if (dicomPreviewRef.current) dicomPreviewRef.current.innerHTML = "";
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (
                !acceptedMimeTypes.includes(selectedFile.type) &&
                !selectedFile.name.toLowerCase().endsWith(".dcm")
            ) {
                setError(
                    "Nepodržani format datoteke. Molimo pošaljite JPG, PNG ili DICOM datoteke."
                );
                return;
            }
            setFile(selectedFile);
            if (
                selectedFile.type.startsWith("image/") &&
                !selectedFile.name.toLowerCase().endsWith(".dcm")
            ) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setError(null);
        if (event.dataTransfer.files.length > 0) {
            const droppedFile = event.dataTransfer.files[0];
            if (
                acceptedMimeTypes.includes(droppedFile.type) ||
                droppedFile.name.toLowerCase().endsWith(".dcm")
            ) {
                setFile(droppedFile);
                if (
                    droppedFile.type.startsWith("image/") &&
                    !droppedFile.name.toLowerCase().endsWith(".dcm")
                ) {
                    setPreviewUrl(URL.createObjectURL(droppedFile));
                } else {
                    setPreviewUrl(null);
                }
            } else {
                setError(
                    "Nepodržani format datoteke. Molimo pošaljite JPG, PNG ili DICOM datoteke."
                );
            }
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const generateDetailedDiagnosis = (result: string, confidence: number): string => {
        const percent = Math.round(confidence * 100);
        if (result === "PNEUMONIA") {
            return `Pneumonija je otkrivena sa sigurnošću od ${percent}%.`;
        } else {
            return `Nema znakova pneumonije sa pouzdanošću od ${percent}%.`;
        }
    };

    const smoothIncreaseProgress = (
        from: number,
        to: number,
        step = 2,
        delay = 15
    ) => {
        return new Promise<void>((resolve) => {
            let current = from;
            const intervalId = setInterval(() => {
                current += step;
                if (current >= to) {
                    setProgress(to);
                    clearInterval(intervalId);
                    resolve();
                } else {
                    setProgress(current);
                }
            }, delay);
        });
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Molimo prvo odaberite sliku.");
            return;
        }
        setLoading(true);
        setProgress(0);
        setError(null);

        const formData = new FormData();

        const LOADING_DURATION = 9000;
        const startTime = Date.now();

        let lastProgress = 0;
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percent = Math.min((elapsed / LOADING_DURATION) * 100, 99);
            lastProgress = percent;
            setProgress(percent);
        }, 100);

        formData.append("file", file);

        try {
            const response = await axios.post(baseURL + "/api/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const result = response.data.result;
            const confidence = response.data.confidence; // float 0-1
            const insights = response.data.insights || [];

            const detailedDiagnosis = generateDetailedDiagnosis(result, confidence);

            const data: ResultData = {
                diagnosis: detailedDiagnosis,
                confidence: Math.round(confidence * 100),
                insights,
                imageUrl: previewUrl || "", // might be empty for DICOM but ok
            };

            clearInterval(timer);
            // Animate smoothly from lastProgress to 100
            await smoothIncreaseProgress(lastProgress, 100);
            await new Promise((res) => setTimeout(res, 600));
            onResult(data);
            setCurrentStep("Rezultati");
            reset();
        } catch (uploadError) {
            setError("Slanje nije uspjelo. Molimo pokušajte ponovo.");
            clearInterval(timer);
            console.error("Greška prilikom slanja:", uploadError);
            setLoading(false);
            setProgress(0);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    // DICOM preview effect
    useEffect(() => {
        if (!file || !dicomPreviewRef.current) {
            if (dicomPreviewRef.current) dicomPreviewRef.current.innerHTML = "";
            return;
        }
        if (!file.name.toLowerCase().endsWith(".dcm")) {
            if (dicomPreviewRef.current) dicomPreviewRef.current.innerHTML = "";
            return;
        }

        const renderDicom = async () => {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const byteArray = new Uint8Array(arrayBuffer);
                const dataSet = dicomParser.parseDicom(byteArray);

                const rows = dataSet.uint16("x00280010");
                const cols = dataSet.uint16("x00280011");

                if (!rows || !cols) {
                    setError("Ne mogu prikazati DICOM sliku (nedostaju dimenzije).");
                    return;
                }

                // Pixel Data element
                const pixelDataElement = dataSet.elements.x7fe00010;
                if (!pixelDataElement) {
                    setError("Ne mogu pronaći podatke piksela u DICOM datoteci.");
                    return;
                }

                const pixelData = new Uint8Array(
                    dataSet.byteArray.buffer,
                    pixelDataElement.dataOffset,
                    pixelDataElement.length
                );

                // Create canvas
                const canvas = document.createElement("canvas");
                canvas.width = cols;
                canvas.height = rows;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const imageData = ctx.createImageData(cols, rows);

                // Assuming 8-bit grayscale image (common for chest X-rays)
                for (let i = 0; i < pixelData.length; i++) {
                    const val = pixelData[i];
                    imageData.data[i * 4] = val; // R
                    imageData.data[i * 4 + 1] = val; // G
                    imageData.data[i * 4 + 2] = val; // B
                    imageData.data[i * 4 + 3] = 255; // Alpha
                }

                ctx.putImageData(imageData, 0, 0);

                canvas.style.width = "100%";        // scale to full width of container
                canvas.style.height = "auto";       // preserve aspect ratio
                canvas.style.maxHeight = "280px";   // cap vertical size
                canvas.style.objectFit = "contain"; // optional: in case it's treated like an image
                canvas.style.display = "block";     // remove extra bottom spacing
                canvas.style.margin = "0 auto";     // center horizontally



                if (dicomPreviewRef.current) {
                    dicomPreviewRef.current.innerHTML = "";
                    dicomPreviewRef.current.appendChild(canvas);
                    setPreviewUrl(canvas.toDataURL());
                }
            } catch (err) {
                setError("Greška pri prikazu DICOM slike.");
                console.error(err);
            }
        };

        renderDicom();
    }, [file]);

    return (
        <Paper
            elevation={8}
            sx={{
                padding: 4,
                borderRadius: 6,
                backgroundColor: "#0f172a", // tamno plava
                userSelect: "none",
                margin: "0 auto",
                boxShadow: "0 0 24px rgba(100,116,139,0.1)",
                border: "1px solid #1e293b",
            }}
        >
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.dcm,.dicom,application/dicom"
                hidden
                ref={inputRef}
                onChange={handleFileSelect}
            />

            {!previewUrl && !file?.name.toLowerCase().endsWith(".dcm") && (
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
                        Dodajte RTG snimak
                    </Typography>

                    <Typography variant="body2" color="#64748b" mb={2}>
                        Dozvoljeni formati: JPG, PNG, JPEG, DICOM.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
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
                        Dodaj datoteku
                    </Button>
                </Box>
            )}

            {previewUrl && !file?.name.toLowerCase().endsWith(".dcm") && (
                <Box mb={3} textAlign="center" position="relative">
                    <img
                        src={previewUrl}
                        alt="Pregled RTG snimka"
                        style={{
                            maxWidth: "100%",
                            maxHeight: 280,
                            borderRadius: 12,
                            border: "1px solid #334155",
                        }}
                    />
                </Box>
            )}

            {file?.name.toLowerCase().endsWith(".dcm") && (
                <Box
                    mb={3}
                    textAlign="center"
                    position="relative"
                    ref={dicomPreviewRef}
                    sx={{
                        maxWidth: "100%",
                        height: 280,          // fixed height
                        borderRadius: 12,
                        border: "1px solid #334155",
                        overflow: "hidden",   // no scroll
                        margin: "0 auto",
                    }}
                />
            )}

            {loading && (
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <CircularProgress size={48} sx={{ color: "#6366f1" }} />
                    <Typography mt={2} color="#cbd5e1">
                        Analiza RTG snimka...
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
                    Upute za slanje
                </Typography>

                <Stack spacing={1.5}>
                    {[
                        "Formati slike: JPEG, PNG, JPG, DICOM",
                        "Minimalna rezolucija: 512×512 px",
                        "Osigurajte jasan, neometan prikaz grudnog koša",
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
                                <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
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
                    {file ? "Analiziraj RTG snimak" : "Učitaj RTG snimak"}
                </Button>
            </Box>
        </Paper>
    );
};

export default UploadSection;
