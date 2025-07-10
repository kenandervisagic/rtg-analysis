import {Box} from "@mui/material";
import UploadSection from "./components/UploadSection.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ResultSection, {type ResultData} from "./components/ResultSection.tsx";
import {useState} from "react";

const mockedResponse: ResultData = {
    diagnosis: "Pneumonia",
    confidence: 87,
    insights: [
        "Lung opacity detected",
        "Bilateral consolidation observed",
        "Possible early stage infection",
    ],
    imageUrl: "", // will be overridden by actual uploaded image URL
    heatmapUrl:
        "https://images.unsplash.com/photo-1584036561584-b03c19da874c?auto=format&fit=crop&w=800&q=80", // placeholder heatmap image
};

function App() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [resultData, setResultData] = useState<ResultData | null>(null);

    const handleUploadSuccess = (imageUrl: string) => {
        setUploadedImage(imageUrl);

        // Simulate backend delay and inject mock
        setTimeout(() => {
            setResultData({
                ...mockedResponse,
                imageUrl,
            });
        }, 1500); // simulate analysis time
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            fontFamily="Roboto, sans-serif"
            bgcolor="#f9f9f9"
        >
            <Header/>
            <Box flex="1" p={3}>
                <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                    {!uploadedImage &&
                        <Box width={{xs: "100%", md: "40%"}}>
                            <UploadSection onSuccess={handleUploadSuccess}/>
                        </Box>
                    }
                    {resultData && (
                        <Box width={{xs: "100%", md: "40%"}}>
                            <ResultSection data={resultData}/>
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer/>
        </Box>
    );
}

export default App;