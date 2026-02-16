import React from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { getSkillChipSx, getSkillKey } from "../../../utils/skillColors";

export default function ProjectDetailsModal({ open, onClose, project, onSubmitProposal }) {
    const theme = useTheme();

    if (!project) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        {project.title}
                    </Typography>

                    <Button
                        onClick={onClose}
                        variant="text"
                        sx={{ minWidth: 40, borderRadius: 2 }}
                    >
                        <CloseRoundedIcon />
                    </Button>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Stack spacing={2.2}>
                    {/* Meta */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                    >
                        <Typography color="text.secondary">
                            {project.postedAt} • {project.level}
                        </Typography>

                        <Typography sx={{ fontWeight: 900 }}>
                            Budget: ${project.budgetMin} – ${project.budgetMax}
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* Description */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                            Description
                        </Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>
                            {project.longDescription || project.description}
                        </Typography>
                    </Box>

                    {/* Skills */}
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                            Skills Required
                        </Typography>

                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {(project.skills || []).map((skill) => (
                                <Chip
                                    key={getSkillKey(skill)}
                                    label={typeof skill === "string"
                                        ? skill
                                        : (skill.original_title || skill.persian_title || skill.name)}
                                    sx={getSkillChipSx(theme, skill)}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Client box */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255,255,255,0.04)"
                                    : "rgba(0,0,0,0.03)",
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
                            Client
                        </Typography>
                        <Typography color="text.secondary">
                            {project.client?.name} • {project.client?.location}
                        </Typography>
                    </Box>

                    {/* Actions */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="flex-end">
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800 }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => onSubmitProposal?.(project)}
                            sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 900 }}
                        >
                            Submit Proposal
                        </Button>

                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
