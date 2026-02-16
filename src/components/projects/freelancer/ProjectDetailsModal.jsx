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
import ProjectDetailsContent from "../ProjectDetailsContent";
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
                <ProjectDetailsContent
                    project={project}
                    onClose={onClose}
                    onSubmitProposal={onSubmitProposal}
                    showClose={true}
                />
            </DialogContent>

        </Dialog>
    );
}
