import { Avatar, Box, Typography, useMediaQuery } from "@mui/material";

const steps = ["Scan", "Results", "Export", "Contact"];

interface HeaderProps {
    currentStep: string;
}

const Step = ({ step, isActive, isDone, isMobile }: { step: string; isActive: boolean; isDone: boolean; isMobile: boolean }) => (
    <Box display="flex" alignItems="center">
        <Box
            sx={{
                width: isMobile ? 24 : 32,
                height: isMobile ? 24 : 32,
                borderRadius: "50%",
                backgroundColor: isActive ? "#7c3aed" : isDone ? "#6366f1" : "#334155",
                color: isActive || isDone ? "#fff" : "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: isMobile ? 12 : 14,
            }}
        >
            {step.charAt(0)}
        </Box>
        <Typography
            sx={{
                ml: isMobile ? 0.5 : 1,
                color: isActive || isDone ? "#e0e7ff" : "#94a3b8",
                fontWeight: isActive ? "bold" : "normal",
                fontSize: isMobile ? 12 : 14,
            }}
        >
            {step}
        </Typography>
    </Box>
);

const Arrow = ({ isDone, isMobile }: { isDone: boolean; isMobile: boolean }) => (
    <Box
        component="span"
        sx={{
            borderTop: "2px solid",
            borderColor: isDone ? "#6366f1" : "#334155",
            width: isMobile ? 12 : 24,
            height: 0,
            mx: isMobile ? 0.5 : 1,
        }}
    />
);

const Roadmap = ({ isMobile, currentIndex }: { isMobile: boolean; currentIndex: number }) => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap={isMobile ? "wrap" : "nowrap"}
        gap={isMobile ? 0.5 : 1}
        width={isMobile ? "100%" : "auto"}
    >
        {steps.map((step, i) => (
            <>
                <Step step={step} isActive={i === currentIndex} isDone={i < currentIndex} isMobile={isMobile} />
                {i < steps.length - 1 && <Arrow isDone={i < currentIndex} isMobile={isMobile} />}
            </>
        ))}
    </Box>
);

const Header = ({ currentStep }: HeaderProps) => {
    const currentIndex = steps.indexOf(currentStep);
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            px={isMobile ? 2 : 4}
            py={2}
            bgcolor="#0f172a"
            borderBottom="1px solid #1e293b"
            color="#94a3b8"
            fontFamily="Roboto, sans-serif"
            width="100%"
        >
            {isMobile ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: 18,
                                }}
                            >
                                PA
                            </Box>
                            <Typography variant="h6" color="#e2e8f0">
                                PneumoAI
                            </Typography>
                        </Box>
                        <Avatar alt="Lily Bennett" src="/kd.jpg" sx={{ width: 36, height: 36 }} />
                    </Box>
                    <Roadmap isMobile={true} currentIndex={currentIndex} />
                </>
            ) : (
                <>
                    <Box flex="0 0 auto" display="flex" alignItems="center" gap={2}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: 18,
                            }}
                        >
                            PA
                        </Box>
                        <Typography variant="h6" color="#e2e8f0">
                            PneumoAI
                        </Typography>
                    </Box>
                    <Box flex="1" display="flex" justifyContent="center">
                        <Roadmap isMobile={false} currentIndex={currentIndex} />
                    </Box>
                    <Box flex="0 0 auto">
                        <Avatar alt="Lily Bennett" src="/kd.jpg" sx={{ width: 36, height: 36 }} />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Header;