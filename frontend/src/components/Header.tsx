import { Box, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => (
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={1}
        sx={{
            backgroundColor: '#e3f2fd', // light medical blue
            boxShadow: 1
        }}
    >
        <Typography variant="h5" fontWeight="bold" color="#1565c0">
            PneumoDetect AI
        </Typography>

        <IconButton>
            <AccountCircleIcon fontSize="large" sx={{ color: '#1565c0' }} />
        </IconButton>
    </Box>
);

export default Header;
