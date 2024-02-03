import React, { useState } from "react";
import {
  BooleanInput,
  Button,
  DateTimeInput,
  NumberInput,
  SaveButton,
  SimpleForm,
  Toolbar,
  useCreate,
  useDelete,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";
import BlockIcon from "@mui/icons-material/Block";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import IconCancel from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { alpha, useTheme } from "@mui/material/styles";

const DeleteMediaDialog = ({ open, loading, onClose, onSend }) => {
  const translate = useTranslate();

  const dateParser = v => {
    const d = new Date(v);
    if (isNaN(d)) return 0;
    return d.getTime();
  };

  const DeleteMediaToolbar = props => {
    return (
      <Toolbar {...props}>
        <SaveButton
          label="resources.delete_media.action.send"
          icon={<DeleteSweepIcon />}
        />
        <Button label="ra.action.cancel" onClick={onClose}>
          <IconCancel />
        </Button>
      </Toolbar>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} loading={loading}>
      <DialogTitle>
        {translate("resources.delete_media.action.send")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {translate("resources.delete_media.helper.send")}
        </DialogContentText>
        <SimpleForm
          toolbar={<DeleteMediaToolbar />}
          redirect={false}
          save={onSend}
        >
          <DateTimeInput
            fullWidth
            source="before_ts"
            label="resources.delete_media.fields.before_ts"
            defaultValue={0}
            parse={dateParser}
          />
          <NumberInput
            fullWidth
            source="size_gt"
            label="resources.delete_media.fields.size_gt"
            defaultValue={0}
            min={0}
            step={1024}
          />
          <BooleanInput
            fullWidth
            source="keep_profiles"
            label="resources.delete_media.fields.keep_profiles"
            defaultValue={true}
          />
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteMediaButton = props => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const [deleteOne, { isLoading }] = useDelete("delete_media");

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleSend = values => {
    deleteOne(
      { payload: { ...values } },
      {
        onSuccess: () => {
          notify("resources.delete_media.action.send_success");
          handleDialogClose();
        },
        onError: () =>
          notify("resources.delete_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  return (
    <>
      <Button
        label="resources.delete_media.action.send"
        onClick={handleDialogOpen}
        disabled={isLoading}
        sx={{
          color: theme.palette.error.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            "@media (hover: none)": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <DeleteSweepIcon />
      </Button>
      <DeleteMediaDialog
        open={open}
        onClose={handleDialogClose}
        onSend={handleSend}
      />
    </>
  );
};

export const ProtectMediaButton = props => {
  const record = useRecordContext();
  const translate = useTranslate();
  const refresh = useRefresh();
  const notify = useNotify();
  const [create, { loading }] = useCreate("protect_media");
  const [deleteOne] = useDelete("protect_media");

  if (!record) return null;

  const handleProtect = () => {
    create(
      { payload: { data: record } },
      {
        onSuccess: () => {
          notify("resources.protect_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.protect_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  const handleUnprotect = () => {
    deleteOne(
      { payload: { ...record } },
      {
        onSuccess: () => {
          notify("resources.protect_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.protect_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  return (
    /*
    Wrapping Tooltip with <div>
    https://github.com/marmelab/react-admin/issues/4349#issuecomment-578594735
    */
    <>
      {record.quarantined_by && (
        <Tooltip
          title={translate("resources.protect_media.action.none", {
            _: "resources.protect_media.action.none",
          })}
        >
          <div>
            {/*
            Button instead BooleanField for
            consistent appearance and position in the column
            */}
            <Button disabled={true}>
              <ClearIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {record.safe_from_quarantine && (
        <Tooltip
          title={translate("resources.protect_media.action.delete", {
            _: "resources.protect_media.action.delete",
          })}
          arrow
        >
          <div>
            <Button onClick={handleUnprotect} disabled={loading}>
              <LockIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {!record.safe_from_quarantine && !record.quarantined_by && (
        <Tooltip
          title={translate("resources.protect_media.action.create", {
            _: "resources.protect_media.action.create",
          })}
        >
          <div>
            <Button onClick={handleProtect} disabled={loading}>
              <LockOpenIcon />
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};

export const QuarantineMediaButton = props => {
  const record = useRecordContext();
  const translate = useTranslate();
  const refresh = useRefresh();
  const notify = useNotify();
  const [create, { loading }] = useCreate("quarantine_media");
  const [deleteOne] = useDelete("quarantine_media");

  if (!record) return null;

  const handleQuarantaine = () => {
    create(
      { payload: { data: record } },
      {
        onSuccess: () => {
          notify("resources.quarantine_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.quarantine_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  const handleRemoveQuarantaine = () => {
    deleteOne(
      { payload: { ...record } },
      {
        onSuccess: () => {
          notify("resources.quarantine_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.quarantine_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  return (
    <>
      {record.safe_from_quarantine && (
        <Tooltip
          title={translate("resources.quarantine_media.action.none", {
            _: "resources.quarantine_media.action.none",
          })}
        >
          <div>
            <Button disabled={true}>
              <ClearIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {record.quarantined_by && (
        <Tooltip
          title={translate("resources.quarantine_media.action.delete", {
            _: "resources.quarantine_media.action.delete",
          })}
        >
          <div>
            <Button onClick={handleRemoveQuarantaine} disabled={loading}>
              <BlockIcon color="error" />
            </Button>
          </div>
        </Tooltip>
      )}
      {!record.safe_from_quarantine && !record.quarantined_by && (
        <Tooltip
          title={translate("resources.quarantine_media.action.create", {
            _: "resources.quarantine_media.action.create",
          })}
        >
          <div>
            <Button onClick={handleQuarantaine} disabled={loading}>
              <BlockIcon />
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};
