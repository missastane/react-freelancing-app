import React from "react";
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import {
    AdminPanelSettingsOutlined,
    BadgeOutlined,
    CalendarTodayOutlined,
    Close,
    EmailOutlined,
    FingerprintOutlined,
    FemaleOutlined,
    MaleOutlined,
    PersonOutline,
    PhoneOutlined,
    ScheduleOutlined,
    SecurityOutlined,
    UpdateOutlined,
    VerifiedUserOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAdminUser } from "../../../../hooks/admin/admin-user/useAdminUser";
import BaseDialog from "../../../common/BaseDialog";
import InfoItem from "./sections/DialogInfoItem";

import DialogSectionCard from "./sections/DialogSectionCard"
export default function AdminUserDetailsDialog({ open, adminId, onClose }) {
    const { t, i18n } = useTranslation();
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAdminUser(open ? adminId : null);

    // Supports both a direct JsonResource response and an API envelope.
    const admin = data?.data ?? data;

    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return new Intl.DateTimeFormat(i18n.language, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    const isActive =
        admin?.activation === 1 ||
        admin?.activation === true;

    const roles = admin?.roles ?? [];
    const permissions = admin?.permissions ?? [];

    return (
        <BaseDialog
            open={open}
            onClose={onClose}
            fullScreen
            PaperProps={{
                sx: {
                    backgroundColor: "#f7f7ff",
                    backgroundImage: `
                        radial-gradient(ellipse at 0% 0%, rgba(167, 139, 250, 0.20) 0%, transparent 42%),
                        radial-gradient(ellipse at 100% 0%, rgba(96, 165, 250, 0.17) 0%, transparent 40%),
                        radial-gradient(ellipse at 100% 100%, rgba(196, 181, 253, 0.18) 0%, transparent 38%),
                        linear-gradient(135deg, #f8f7ff 0%, #f2f5ff 55%, #f8f6ff 100%)
                    `,
                },
            }}
        >
            {/* Dialog header */}
            <Box
                sx={{
                    px: { xs: 2, md: 4 },
                    py: 2,
                    bgcolor: "rgba(255,255,255,0.76)",
                    backdropFilter: "blur(14px)",
                    borderBottom: "1px solid rgba(148,163,184,0.16)",
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                bgcolor: "primary.main",
                            }}
                        >
                            <PersonOutline />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={800}>
                                {t("admin.users.details.title")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t("admin.users.details.subtitle")}
                            </Typography>
                        </Box>
                    </Stack>

                    <IconButton onClick={onClose} aria-label="Close">
                        <Close />
                    </IconButton>
                </Stack>
            </Box>

            <DialogContent
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    width: "100%",
                    maxWidth: 1360,
                    mx: "auto",
                }}
            >
                {isLoading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight={360}
                    >
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Alert
                        severity="error"
                        action={
                            <Chip
                                label={t("common.retry")}
                                clickable
                                onClick={() => refetch()}
                                color="error"
                                variant="outlined"
                            />
                        }
                    >
                        {error?.response?.data?.message ||
                            t("admin.users.details.loadError")}
                    </Alert>
                ) : admin ? (
                    <Stack spacing={3}>
                        {/* Gradient profile banner */}
                        <Card
                            sx={{
                                overflow: "hidden",
                                position: "relative",
                                borderRadius: 4,
                                color: "#fff",
                                background:
                                    "linear-gradient(115deg, #a78bfa 0%, #818cf8 48%, #60a5fa 100%)",
                                boxShadow: "0 12px 34px rgba(99,102,241,0.20)",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    width: 300,
                                    height: 300,
                                    right: { xs: -160, sm: 90 },
                                    top: -210,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(255,255,255,0.14)",
                                    boxShadow:
                                        "0 0 0 35px rgba(255,255,255,0.04), 0 0 0 75px rgba(255,255,255,0.035)",
                                    pointerEvents: "none",
                                },
                            }}
                        >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2.5}
                                    alignItems={{ xs: "flex-start", sm: "center" }}
                                >
                                    <Avatar
                                        src={admin.avatar_photo || undefined}
                                        alt={`${admin.first_name || ""} ${admin.last_name || ""}`}
                                        sx={{
                                            width: 82,
                                            height: 82,
                                            fontSize: 28,
                                            border: "4px solid rgba(255,255,255,0.42)",
                                            boxShadow: "0 5px 18px rgba(40,35,90,0.16)",
                                        }}
                                    >
                                        {admin.first_name?.charAt(0)}
                                    </Avatar>

                                    <Box flex={1} minWidth={0}>
                                        <Typography variant="h5" fontWeight={800}>
                                            {`${admin.first_name || ""} ${admin.last_name || ""}`.trim() ||
                                                admin.username}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.88, mt: 0.4 }}>
                                            @{admin.username || "—"}
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        <Chip
                                            label={
                                                isActive
                                                    ? t("admin.users.status.active")
                                                    : t("admin.users.status.inactive")
                                            }
                                            size="small"
                                            sx={{
                                                color: isActive ? "#166534" : "#514267",
                                                bgcolor: isActive
                                                    ? "rgba(220,252,231,0.96)"
                                                    : "rgba(255,255,255,0.78)",
                                                fontWeight: 700,
                                            }}
                                        />
                                        <Chip
                                            label={`#${admin.id}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                color: "#fff",
                                                borderColor: "rgba(255,255,255,0.55)",
                                                fontWeight: 700,
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Personal information */}
                        <DialogSectionCard
                            title={t("admin.users.details.basicInfo")}
                            icon={<PersonOutline />}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, minmax(0, 1fr))",
                                        md: "repeat(4, minmax(0, 1fr))",
                                        lg: "repeat(5, minmax(0, 1fr))",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                <InfoItem
                                    label={t("admin.users.fields.firstName")}
                                    value={admin.first_name}
                                    icon={<PersonOutline />}
                                />
                                <InfoItem
                                    label={t("admin.users.fields.lastName")}
                                    value={admin.last_name}
                                    icon={<PersonOutline />}
                                />
                                <InfoItem
                                    label={t("admin.users.fields.username")}
                                    value={admin.username}
                                    icon={<BadgeOutlined />}
                                />
                                <InfoItem
                                    label={t("admin.users.fields.email")}
                                    value={admin.email}
                                    icon={<EmailOutlined />}
                                />
                                <InfoItem
                                    label={t("admin.users.details.mobile")}
                                    value={admin.mobile}
                                    icon={<PhoneOutlined />}
                                />
                                <InfoItem
                                    label={t("admin.users.details.nationalCode")}
                                    value={admin.national_code}
                                    icon={<FingerprintOutlined />}
                                />
                                <InfoItem
                                    label={t("admin.users.details.gender")}
                                    value={admin.gender_type}
                                    icon={
                                        admin.gender === 2 ? (
                                            <FemaleOutlined />
                                        ) : (
                                            <MaleOutlined />
                                        )
                                    }
                                />
                                <InfoItem
                                    label={t("admin.users.details.birthDate")}
                                    value={formatDate(admin.birth_date)}
                                    icon={<CalendarTodayOutlined />}
                                />
                                <InfoItem
                                    label={t("admin.users.details.activeRole")}
                                    value={admin.active_role}
                                    icon={<AdminPanelSettingsOutlined />}
                                />
                            </Box>
                        </DialogSectionCard>

                        {/* Account information */}
                        <DialogSectionCard
                            title={t("admin.users.details.accountInfo")}
                            icon={<SecurityOutlined />}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, minmax(0, 1fr))",
                                        md: "repeat(5, minmax(0, 1fr))",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                <InfoItem
                                    label={t("admin.users.details.emailVerified")}
                                    value={
                                        admin.email_verified_at
                                            ? formatDate(admin.email_verified_at)
                                            : t("admin.users.details.notVerified")
                                    }
                                    icon={<EmailOutlined />}
                                    status={
                                        admin.email_verified_at
                                            ? "verified"
                                            : "unverified"
                                    }
                                />
                                <InfoItem
                                    label={t("admin.users.details.mobileVerified")}
                                    value={
                                        admin.mobile_verified_at
                                            ? formatDate(admin.mobile_verified_at)
                                            : t("admin.users.details.notVerified")
                                    }
                                    icon={<PhoneOutlined />}
                                    status={
                                        admin.mobile_verified_at
                                            ? "verified"
                                            : "unverified"
                                    }
                                />
                                <InfoItem
                                    label={t("admin.users.details.activationDate")}
                                    value={formatDate(admin.activation_date)}
                                    icon={<ScheduleOutlined />}
                                    status={
                                        admin.activation_date
                                            ? "verified"
                                            : "unverified"
                                    }
                                />
                                <InfoItem
                                    label={t("admin.users.details.createdAt")}
                                    value={formatDate(admin.created_at)}
                                    icon={<CalendarTodayOutlined />}
                                    status={
                                        admin.created_at
                                            ? "verified"
                                            : "unverified"
                                    }
                                />
                                <InfoItem
                                    label={t("admin.users.details.updatedAt")}
                                    value={formatDate(admin.updated_at)}
                                    icon={<UpdateOutlined />}
                                    status={
                                        admin.updated_at
                                            ? "verified"
                                            : "unverified"
                                    }
                                />
                            </Box>

                            {admin.about_me && (
                                <>
                                    <Divider sx={{ my: 2.5, borderColor: "rgba(148,163,184,0.2)" }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        {t("admin.users.details.aboutMe")}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                                    >
                                        {admin.about_me}
                                    </Typography>
                                </>
                            )}
                        </DialogSectionCard>

                        {/* Roles and permissions */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, minmax(0, 1fr))",
                                },
                                gap: 2,
                            }}
                        >
                            <DialogSectionCard
                                title={t("admin.users.details.roles")}
                                icon={<AdminPanelSettingsOutlined />}
                                count={roles.length}
                            >
                                {roles.length ? (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {roles.map((role) => (
                                            <Chip
                                                key={role.id}
                                                label={role.name}
                                                icon={<VerifiedUserOutlined />}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ borderRadius: 2, fontWeight: 600 }}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        {t("admin.users.details.noRoles")}
                                    </Typography>
                                )}
                            </DialogSectionCard>

                            <DialogSectionCard
                                title={t("admin.users.details.permissions")}
                                icon={<SecurityOutlined />}
                                count={permissions.length}
                            >
                                {permissions.length ? (
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {permissions.map((permission) => (
                                            <Chip
                                                key={permission.id}
                                                label={permission.name}
                                                icon={<VerifiedUserOutlined />}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: 2, fontWeight: 500 }}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        {t("admin.users.details.noPermissions")}
                                    </Typography>
                                )}
                            </DialogSectionCard>
                        </Box>
                    </Stack>
                ) : null}

                {isFetching && !isLoading && (
                    <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
                        <CircularProgress size={22} />
                    </Box>
                )}
            </DialogContent>
        </BaseDialog>
    );
}
