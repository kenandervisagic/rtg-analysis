import {Box} from "@mui/material";
import UploadSection from "./components/UploadSection.tsx";
import Header from "./components/Header.tsx";

function App() {

    return (
        <>
            <Header/>
            <Box p={3} style={{fontFamily: 'Roboto, sans-serif', backgroundColor: '#f9f9f9'}}>
                <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                    <Box width={{xs: '100%', md: '40%'}}>
                        <UploadSection/>
                    </Box>
                </Box>
            </Box>
        </>

    )
}

export default App
