import {Box} from "@mui/material";
import UploadSection, {type ResultData} from "./components/UploadSection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResultSection from "./components/ResultSection";
import {useState} from "react";

function App() {
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [currentStep, setCurrentStep] = useState("Skeniranje");

    // This is called when UploadSection finishes uploading and has result data
    const handleResult = (data: ResultData) => {
        setResultData(data);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            fontFamily="Roboto, sans-serif"
            bgcolor="#0f172a"
        >
            <Header currentStep={currentStep}/>
            <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                px={2}
                py={4}
                sx={{
                    backgroundColor: "#0f172a",
                }}
            >
                {!resultData ? (
                    <Box width="100%" maxWidth={800}>
                        <UploadSection onResult={handleResult} setCurrentStep={setCurrentStep}/>
                    </Box>
                ) : (
                    <Box width="100%" maxWidth={600}>
                        <ResultSection data={resultData} setCurrentStep={setCurrentStep} setResultData={setResultData}/>
                    </Box>
                )}
            </Box>
            <Footer/>
        </Box>
    );
}

export default App;
