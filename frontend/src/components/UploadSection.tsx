import {Box, Button, Paper, Typography} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadSection = () => (
    <Paper elevation={3} style={{padding: 24, borderRadius: 16}}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CloudUploadIcon style={{fontSize: 48, color: '#8c30f5'}}/>
            <Typography variant="h6">Upload Chest X-Ray</Typography>
            <Typography variant="body2" color="textSecondary">
                Drag and drop your X-ray image or click to browse
            </Typography>
            <Button variant="contained" style={{backgroundColor: '#8c30f5', borderRadius: 50}}>
                Select Image
            </Button>
        </Box>

        <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
                Upload Guidelines
            </Typography>
            <ul style={{paddingLeft: 20, margin: 0}}>
                <li>High-quality chest X-ray images (JPEG, PNG)</li>
                <li>Minimum resolution: 512x512 pixels</li>
                <li>Clear, unobstructed chest view</li>
            </ul>
        </Box>
        <Box mt={3} textAlign="center">
            <Button variant="contained" fullWidth style={{backgroundColor: '#8c30f5', borderRadius: 50}}>
                Analyze X-Ray
            </Button>
        </Box>
    </Paper>
);
export default UploadSection;