import {Box, Button, Card, Chip, Divider, LinearProgress, Stack, Typography} from "@mui/material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';

export interface ResultData {
    diagnosis: string;
    confidence: number;
    insights: string[];
    imageUrl: string;
}

interface ResultSectionProps {
    data: ResultData;
    setCurrentStep: (step: string) => void;
    setResultData: (data: ResultData | null) => void;
    onExportSuccess: () => void;

}

const ResultSection = ({data, setCurrentStep, setResultData, onExportSuccess}: ResultSectionProps) => {
    const handleExport = () => {
        onExportSuccess();
        setCurrentStep("Izvoz");
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
            <Stack spacing={3}>
                <Box textAlign="center">
                    <img
                        src={data.imageUrl}
                        alt="RTG"
                        style={{
                            width: "100%",
                            objectFit: "contain",
                            maxHeight: 240,
                            borderRadius: 12,
                            border: "1px solid #334155",
                        }}
                    />
                    <Typography variant="caption" mt={1} display="block" color="#94a3b8">
                        Analizirana RTG snimka
                    </Typography>
                </Box>

                <Divider sx={{borderColor: "#334155"}}/>

                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{color: "#cbd5e1"}}
                    >
                        <LocalHospitalIcon
                            fontSize="small"
                            sx={{mr: 1, verticalAlign: "middle", color: "#7c3aed"}}
                        />
                        Dijagnoza
                    </Typography>
                    <Chip
                        label={data.diagnosis}
                        sx={{
                            backgroundColor: "#7c3aed33",
                            color: "#e0d7ff",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                        }}
                    />
                </Box>

                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{color: "#cbd5e1"}}
                    >
                        <TrendingUpIcon
                            fontSize="small"
                            sx={{mr: 1, verticalAlign: "middle", color: "#7c3aed"}}
                        />
                        Stepen sigurnosti
                    </Typography>
                    <Typography variant="h6" color="#7c3aed" fontWeight="bold">
                        {data.confidence}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={data.confidence}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            mt: 1,
                            backgroundColor: "#334155",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "#7c3aed",
                            },
                        }}
                    />
                </Box>

                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{color: "#cbd5e1"}}
                    >
                        <InsightsIcon
                            fontSize="small"
                            sx={{mr: 1, verticalAlign: "middle", color: "#7c3aed"}}
                        />
                        AI uvid
                    </Typography>
                    <Stack
                        component="ul"
                        spacing={0.5}
                        sx={{pl: 2, m: 0, color: "#94a3b8"}}
                    >
                        {data.insights.map((item, i) => (
                            <Typography component="li" key={i} variant="body2">
                                {item}
                            </Typography>
                        ))}
                    </Stack>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="space-between" pt={2}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            setCurrentStep("Skeniranje");
                            setResultData(null);
                        }}
                        sx={{
                            color: "#94a3b8",
                            borderColor: "#334155",
                            textTransform: "none",
                            "&:hover": {
                                borderColor: "#7c3aed",
                                color: "#7c3aed",
                                backgroundColor: "#1f2a3c",
                            },
                        }}
                    >
                        Analiziraj ponovo
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleExport}
                        sx={{
                            background: "linear-gradient(90deg, #6366f1, #7c3aed)",
                            color: "#fff",
                            textTransform: "none",
                            "&:hover": {
                                background: "linear-gradient(90deg, #7c3aed, #6366f1)",
                                boxShadow: "0 0 14px rgba(124, 58, 237, 0.5)",
                            },
                        }}
                    >
                        Izvezi rezultate
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
};

export default ResultSection;
