import {Box} from "@mui/material";
import UploadSection, {type ResultData} from "./components/UploadSection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResultSection from "./components/ResultSection";
import ReportPreview from "./components/ReportPreview";
import {useState} from "react";

function App() {
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [currentStep, setCurrentStep] = useState("Skeniranje");
    const [showReportPreview, setShowReportPreview] = useState(false);

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
                sx={{backgroundColor: "#0f172a"}}
            >
                <Box width="100%" maxWidth={showReportPreview ? 600 : 800}>
                    {!resultData ? (
                        <UploadSection onResult={handleResult} setCurrentStep={setCurrentStep}/>
                    ) : showReportPreview ? (
                        <ReportPreview
                            data={resultData}
                            onBack={() => {
                                setShowReportPreview(false);
                                setCurrentStep("Rezultati")
                            }}
                        />
                    ) : (
                        <ResultSection
                            data={resultData}
                            setCurrentStep={setCurrentStep}
                            setResultData={setResultData}
                            onExportSuccess={() => setShowReportPreview(true)}
                        />
                    )}
                </Box>
            </Box>
            <Footer/>
        </Box>
    );
}

export default App;
