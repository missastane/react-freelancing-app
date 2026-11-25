import * as React from "react";
import SecurityHintBox from "../shared/SecurityHintBox"
import SecurityRow from "../shared/SecurityRow"
import SecuritySectionCard from "../shared/SecuritySectionCard"
import {
    Box,
    Button,
    Chip,
    Divider,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";

const TrustedDevicesSection = () => {
    const [prefs, setPrefs] = React.useState({
        loginAlertsEmail: true,
        loginAlertsInApp: true,
        rememberDevice30d: true,
    });
    const [trusted, setTrusted] = React.useState([
        { id: "td_1", name: "Chrome on Windows", added: "2026-02-10", lastUsed: "Today" },
        { id: "td_2", name: "Safari on iPhone", added: "2026-02-12", lastUsed: "Yesterday" },
    ]);
    
    return (
        <SecuritySectionCard
            title="Trusted devices"
            subtitle="Devices you chose to trust (skip frequent verification)."
            icon={<DevicesIcon fontSize="small" />}
            right={
                <Switch
                    checked={prefs.rememberDevice30d}
                    onChange={(e) => setPrefs((s) => ({ ...s, rememberDevice30d: e.target.checked }))}
                />
            }
        >
            <Stack spacing={1}>
                <SecurityRow
                    title="Remember devices for 30 days"
                    desc="Reduce 2FA prompts on trusted devices."
                    action={<Chip size="small" label={prefs.rememberDevice30d ? "On" : "Off"} />}
                />

                <Divider />

                {trusted.length === 0 ? (
                    <Typography color="text.secondary">No trusted devices yet.</Typography>
                ) : (
                    <Stack spacing={1}>
                        {trusted.map((t, idx) => (
                            <React.Fragment key={t.id}>
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={1.5}
                                    sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", py: 0.75 }}
                                >
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>{t.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Added: {t.added} · Last used: {t.lastUsed}
                                        </Typography>
                                    </Box>
                                    <Button variant="outlined" color="error" onClick={() => removeTrusted(t.id)}>
                                        Remove
                                    </Button>
                                </Stack>
                                {idx !== trusted.length - 1 ? <Divider /> : null}
                            </React.Fragment>
                        ))}
                    </Stack>
                )}

                <SecurityHintBox>
                    <Typography variant="body2" color="text.secondary">
                        Removing a trusted device may require 2FA again the next time you sign in from it.
                    </Typography>
                </SecurityHintBox>
            </Stack>
        </SecuritySectionCard>
    )
}

export default TrustedDevicesSection