import {Box, Divider, Typography} from "@mui/material";
import UploadSection from "./components/UploadSection.tsx";
import ResultSection from "./components/ResultSection.tsx";

function App() {

    return (
        <Box p={3} style={{fontFamily: 'Roboto, sans-serif', backgroundColor: '#f9f9f9', minHeight: '90vh'}}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" style={{color: '#8c30f5'}}>
                    PneumoDetect AI
                </Typography>
                <Typography variant="subtitle2">Advanced Chest X-Ray Analysis System</Typography>
            </Box>

            <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                <Box width={{xs: '100%', md: '40%'}}>
                    <UploadSection/>
                </Box>
                {/*<Box width={{xs: '100%', md: '50%'}}>*/}
                {/*    <ResultSection/>*/}
                {/*</Box>*/}
            </Box>

            <Divider style={{margin: '40px 0'}}/>
            <Box display="flex" justifyContent="space-between" fontSize={12} color="gray">
                <Typography>🧬 FDA Approved Algorithm</Typography>
                <Typography>🔒 HIPAA Compliant</Typography>
                <Typography>Results are for reference only. Consult a medical professional for
                    diagnosis.</Typography>
            </Box>
        </Box>
    )
}

export default App
