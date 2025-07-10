import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface ResultData {
    diagnosis: string;
    confidence: number;
    insights: string[];
    imageUrl: string;
    heatmapUrl: string;
}

const ResultSection = ({ data }: { data: ResultData }) => {
    return (
        <Card
            elevation={4}
            sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: "#ffffff",
            }}
        >
            <Stack spacing={3}>
                {/* X-ray Preview */}
                <Box textAlign="center">
                    <img
                        src={data.imageUrl}
                        alt="X-ray"
                        style={{ borderRadius: 12, width: '100%', objectFit: 'cover', maxHeight: 240 }}
                    />
                    <Typography variant="caption" mt={1} display="block" color="text.secondary">
                        Analyzed X-ray
                    </Typography>
                </Box>

                <Divider />

                {/* Diagnosis */}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <LocalHospitalIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Diagnosis
                    </Typography>
                    <Chip
                        label={data.diagnosis}
                        sx={{
                            backgroundColor: '#ffe6e6',
                            color: '#c62828',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                        }}
                    />
                    <Typography variant="body2" mt={1}>
                        Bilateral pneumonia with visible consolidation.
                    </Typography>
                </Box>

                {/* Confidence Score */}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <TrendingUpIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Confidence Score
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                        {data.confidence}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={data.confidence}
                        sx={{ height: 10, borderRadius: 5, mt: 1 }}
                    />
                </Box>

                {/* AI Insights */}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <InsightsIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        AI Insights
                    </Typography>
                    <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
                        {data.insights.map((item, i) => (
                            <Typography component="li" key={i} variant="body2">
                                {item}
                            </Typography>
                        ))}
                    </Stack>
                </Box>

                {/* Heatmap Info */}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <VisibilityIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Heatmap Overlay
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Highlights potential areas of concern using AI activation mapping.
                    </Typography>
                    <Box mt={2}>
                        <img
                            src={data.heatmapUrl}
                            alt="Heatmap"
                            style={{ borderRadius: 12, width: '100%', objectFit: 'cover', maxHeight: 200 }}
                        />
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="space-between" pt={2}>
                    <Button variant="outlined" fullWidth>
                        Export Report
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#8c30f5',
                            color: '#fff',
                            textTransform: 'none',
                            '&:hover': { backgroundColor: '#6a1b9a' }
                        }}
                    >
                        Share Results
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
};

export default ResultSection;
