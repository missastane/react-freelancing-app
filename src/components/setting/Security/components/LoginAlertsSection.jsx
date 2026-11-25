import * as React from "react";
import SecurityRow from "../shared/SecurityRow"
import SecuritySectionCard from "../shared/SecuritySectionCard"
import {
    Divider,
    Stack,
    Switch,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";

const LoginAlertsSection = () => {

    const [prefs, setPrefs] = React.useState({
        loginAlertsEmail: true,
        loginAlertsInApp: true,
        rememberDevice30d: true,
    });

    return (
        <SecuritySectionCard
            title="Login alerts"
            subtitle="Get notified when a new device signs in."
            icon={<ShieldIcon fontSize="small" />}
        >
            <Stack spacing={1}>
                <SecurityRow
                    title="Email alerts"
                    desc="We’ll email you about new device logins."
                    action={
                        <Switch
                            checked={prefs.loginAlertsEmail}
                            onChange={(e) => setPrefs((s) => ({ ...s, loginAlertsEmail: e.target.checked }))}
                        />
                    }
                />
                <Divider />
                <SecurityRow
                    title="In-app alerts"
                    desc="Show login alerts inside the platform."
                    action={
                        <Switch
                            checked={prefs.loginAlertsInApp}
                            onChange={(e) => setPrefs((s) => ({ ...s, loginAlertsInApp: e.target.checked }))}
                        />
                    }
                />
            </Stack>
        </SecuritySectionCard>
    )
}

export default LoginAlertsSection