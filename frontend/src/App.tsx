import { Box, Button } from "@mui/material";
import UploadSection, { type ResultData } from "./components/UploadSection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResultSection from "./components/ResultSection";
import { useState } from "react";

function App() {
    const [resultData, setResultData] = useState<ResultData | null>(null);

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
            bgcolor="#f9f9f9"
        >
            <Header />
            <Box flex="1" p={3}>
                <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                    {!resultData ? (
                        <Box width={{ xs: "100%", md: "40%" }}>
                            <UploadSection onResult={handleResult} />
                        </Box>
                    ) : (
                        <Box width={{ xs: "100%", md: "40%" }}>
                            <ResultSection data={resultData} />
                            <Box mt={4} textAlign="center">
                                <Button
                                    variant="outlined"
                                    onClick={() => setResultData(null)}
                                    sx={{ textTransform: "none" }}
                                >
                                    Analyze Another X-Ray
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}

export default App;
