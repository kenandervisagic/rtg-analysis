// components/ReportPreview.tsx
import { Button, Card, Stack, Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ReportPreviewProps {
    data: {
        diagnosis: string;
        confidence: number;
        insights: string[];
        imageUrl: string;
    };
    onBack: () => void;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || ""; // prazno znači relativni URL

const ReportPreview = ({ data, onBack }: ReportPreviewProps) => {
    // Utility: Convert image URL to base64 string
    const getBase64FromUrl = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleExport = async (format: "pdf" | "docx" | "html") => {
        try {
            let payload = {
                diagnosis: data.diagnosis,
                confidence: data.confidence,
                insights: data.insights,
                imageBase64: "", // will fill below
            };

            if (data.imageUrl) {
                payload.imageBase64 = await getBase64FromUrl(data.imageUrl);
            }

            const response = await fetch(baseURL + `/api/export-${format}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                alert("Greška pri izvozu.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `nalaz.${format}`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error during export:", error);
            alert("Greška pri izvozu.");
        }
    };

    return (
        <Card
            elevation={8}
            sx={{
                p: 4,
                borderRadius: 6,
                backgroundColor: "#0f172a",
                color: "#cbd5e1",
                boxShadow: "0 0 24px rgba(124, 58, 237, 0.3)",
                border: "1px solid #334155",
            }}
        >
            <Stack spacing={4} alignItems="center">
                <Typography variant="h5" color="#cbd5e1">
                    Izvezi nalaz kao:
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => handleExport("pdf")}
                        startIcon={<PictureAsPdfIcon />}
                        sx={{
                            background: "#7c3aed",
                            textTransform: "none",
                            "&:hover": {
                                background: "#6d28d9",
                            },
                        }}
                    >
                        PDF
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DescriptionIcon />}
                        sx={{
                            background: "#7c3aed",
                            textTransform: "none",
                            "&:hover": {
                                background: "#6d28d9",
                            },
                        }}
                    >
                        Word (.docx)
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            background: "#7c3aed",
                            textTransform: "none",
                            "&:hover": {
                                background: "#6d28d9",
                            },
                        }}
                    >
                        HTML
                    </Button>
                </Stack>

                <Button
                    onClick={onBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: "#94a3b8",
                        mt: 2,
                        textTransform: "none",
                        "&:hover": {
                            color: "#7c3aed",
                        },
                    }}
                >
                    Nazad na rezultate
                </Button>
            </Stack>
        </Card>
    );
};

export default ReportPreview;
