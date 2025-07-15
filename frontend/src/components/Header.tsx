import {Avatar, Box, Typography} from "@mui/material";

const steps = ["Scan", "Results", "Export", "Contact"];

interface HeaderProps {
    currentStep: string;
}

const Header = ({ currentStep }: HeaderProps) => {
    const currentIndex = steps.indexOf(currentStep);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={4}
            py={2}
            bgcolor="#0f172a"
            borderBottom="1px solid #1e293b"
            color="#94a3b8"
            fontFamily="Roboto, sans-serif"
        >
            {/* Logo & Title */}
            <Box display="flex" alignItems="center" gap={2}>
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

            {/* Progress roadmap */}
            <Box display="flex" alignItems="center" gap={1} flex={1} justifyContent="center">
                {steps.map((step, i) => {
                    const isDone = i < currentIndex;
                    const isActive = i === currentIndex;

                    return (
                        <Box
                            key={step}
                            display="flex"
                            alignItems="center"
                            sx={{ userSelect: "none" }}
                        >
                            {/* Step circle */}
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    backgroundColor: isActive
                                        ? "#7c3aed"
                                        : isDone
                                            ? "#6366f1"
                                            : "#334155",
                                    color: isActive || isDone ? "#fff" : "#94a3b8",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    transition: "background-color 0.3s",
                                }}
                            >
                                {step.charAt(0)} {/* First letter as icon */}
                            </Box>

                            {/* Step label */}
                            <Typography
                                sx={{
                                    ml: 1,
                                    mr: 2,
                                    color: isActive || isDone ? "#e0e7ff" : "#94a3b8",
                                    fontWeight: isActive ? "bold" : "normal",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {step}
                            </Typography>

                            {/* Arrow (except after last step) */}
                            {i !== steps.length - 1 && (
                                <Box
                                    component="span"
                                    sx={{
                                        borderTop: "2px solid",
                                        borderColor: isDone ? "#6366f1" : "#334155",
                                        width: 24,
                                        height: 0,
                                        ml: -1,
                                        mr: 1,
                                    }}
                                />
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* Avatar */}
            <Box>
                <Avatar
                    alt="Lily Bennett"
                    src="/kd.jpg"
                    sx={{ width: 36, height: 36 }}
                />
            </Box>
        </Box>
    );
};

export default Header;
