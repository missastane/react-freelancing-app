import SecurityRow from "../shared/SecurityRow"
import SecuritySectionCard from "../shared/SecuritySectionCard"
import {
  Button,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";


const PasswordSection = () => {
    return (
        <SecuritySectionCard
            title="Password"
            subtitle="Use a strong, unique password."
            icon={<LockIcon fontSize="small" />}
        >
            <Stack spacing={1}>
                <SecurityRow
                    title="Change password"
                    desc="Minimum 8 characters recommended."
                    action={
                        <Button variant="contained" onClick={() => setPwd((s) => ({ ...s, open: true }))}>
                            Change
                        </Button>
                    }
                />
                <Divider />
                <SecurityRow
                    title="Password reset"
                    desc="If you forgot your password, you can reset it from the login page."
                    action={<Chip size="small" label="Available" />}
                />
            </Stack>
        </SecuritySectionCard>
    )
}

export default PasswordSection