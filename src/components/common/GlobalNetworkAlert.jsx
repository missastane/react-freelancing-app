import React, {
    useCallback,
    useSyncExternalStore,
    useState,
} from "react";

import {
    Alert,
    Button,
    IconButton,
    Snackbar,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import {
    getNetworkError,
    subscribeNetworkError,
    clearNetworkError,
} from "../../services/network.error";

// Only retry network errors and server errors.
const isRetryableNetworkError = (error) => {
    const status = error?.response?.status;

    return !error?.response || status >= 500;
};

const isRetryableQuery = (query) => {
    return (
        Boolean(query.state.error) &&
        query.state.fetchStatus !== "fetching" &&
        isRetryableNetworkError(query.state.error)
    );
};

export default function GlobalNetworkAlert() {
    const queryClient = useQueryClient();

    const networkError = useSyncExternalStore(
        subscribeNetworkError,
        getNetworkError,
        getNetworkError
    );
    const { t } = useTranslation();
    const [isRetrying, setIsRetrying] = useState(false);

    const handleClose = () => {
        clearNetworkError();
    };

    const handleRetry = useCallback(async () => {
        if (isRetrying) {
            return;
        }

        setIsRetrying(true);

        try {
            await queryClient.refetchQueries(
                {
                    type: "active",
                    predicate: isRetryableQuery,
                },
                {
                    throwOnError: true,
                }
            );

            // Keep the alert visible if an active query still has
            // a network or server error.
            const hasFailedQueries = queryClient
                .getQueryCache()
                .findAll({ type: "active" })
                .some(isRetryableQuery);

            if (!hasFailedQueries) {
                clearNetworkError();
            }
        } catch {
            // Axios reports the new failure to the global error service.
        } finally {
            setIsRetrying(false);
        }
    }, [queryClient, isRetrying]);

    if (!networkError) {
        return null;
    }

    const message =
        networkError?.response?.data?.message ||
        (!networkError?.response
            ? t("common.networkError")
            : t("common.serverError"));

    return (
        <Snackbar
            open={Boolean(networkError)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            sx={{
                width: {
                    xs: "calc(100% - 32px)",
                    sm: "auto",
                },
                maxWidth: 650,
            }}
        >
            <Alert
                severity="error"
                variant="filled"
                sx={{
                    width: "100%",
                    alignItems: "center",
                }}
                action={
                    <>
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleRetry}
                            disabled={isRetrying}
                        >
                            {isRetrying
                                ? t("common.retrying")
                                : t("common.retry")}
                        </Button>

                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="Close notification"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                }
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
