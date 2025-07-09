import {Box, Button, Card, Chip, LinearProgress, Typography} from "@mui/material";


const ResultSection = () => (
    <Card elevation={3} style={{padding: 16, borderRadius: 16}}>
        <Box display="flex" flexDirection="column" gap={2}>
            <img
                src="https://via.placeholder.com/300x200"
                alt="Sample X-ray"
                style={{borderRadius: 12}}
            />
            <Typography variant="caption" align="center">Sample X-ray loaded</Typography>

            <Box>
                <Typography variant="subtitle2">Diagnosis</Typography>
                <Chip label="Pneumonia Detected" style={{backgroundColor: '#ffdddd', color: '#8c30f5'}} size="small"/>
                <Typography variant="body2">
                    Bilateral pneumonia with consolidation patterns identified
                </Typography>
            </Box>

            <Box>
                <Typography variant="subtitle2">Confidence Score</Typography>
                <Typography variant="h6" style={{color: '#8c30f5'}}>94.2%</Typography>
                <LinearProgress variant="determinate" value={94.2} style={{height: 10, borderRadius: 8}}/>
            </Box>

            <Box>
                <Typography variant="subtitle2">AI Analysis</Typography>
                <ul style={{paddingLeft: 20, margin: 0}}>
                    <li>Opacity in lower right lobe suggesting infection</li>
                    <li>Bilateral infiltrates consistent with pneumonia</li>
                    <li>Recommend immediate medical consultation</li>
                </ul>
            </Box>

            <Box>
                <Typography variant="subtitle2">Heatmap Overlay</Typography>
                <Typography variant="body2">Visual highlighting of problematic areas</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="outlined">Export Report</Button>
                <Button variant="contained" style={{backgroundColor: '#8c30f5'}}>Share Results</Button>
            </Box>
        </Box>
    </Card>
);

export default ResultSection;