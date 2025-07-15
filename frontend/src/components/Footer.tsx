import { Box, Typography } from "@mui/material";

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                py: 2,
                px: 3,
                textAlign: 'center',
                backgroundColor: '##333',
                color: '#94a3b8',
                fontSize: '0.875rem',
                borderTop: "1px solid #1e293b"
            }}
        >
            <Typography variant="body2">
                © 2025 Kenan Dervisagic. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;
