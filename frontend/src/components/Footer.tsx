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
                backgroundColor: '#e3f2fd',
                color: '#0d47a1',
                fontSize: '0.875rem'
            }}
        >
            <Typography variant="body2">
                © 2025 Kenan Dervisagic. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;
