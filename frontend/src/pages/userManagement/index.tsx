import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserDialog from "./components/AddUserDialog";
import {
  fetchAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { enqueueSnackbarMessage } from "../../store/slices/commonSlice";
import UserEditDialog from "./components/UserEditDialog";
import { LoadingButton } from "@mui/lab";
import { appConfig, firebaseConfig } from "../../config/config";
import { User } from "../../types/types";
import { bgBG } from "@mui/material/locale";

const Users = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);
  const { users, loading } = useAppSelector((state) => state.user);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => user.email === user.email),
    [users]
  );

  const handleEditSubmit = async (updatedData: Partial<User>) => {
    await dispatch(
      updateUser({
        id: updatedData.id,
        role: updatedData.role,
        isActive: updatedData.isActive,
      })
    ).unwrap();

    setOpenEditDialog(false);
    setSelectedUser(null);
    dispatch(fetchAllUsers());
  };

  const handleAddUser = async (userData: {
    name: string;
    email: string;
    type: "student" | "reviewer" | "admin";
  }) => {
    await dispatch(
      addUser({
        name: userData.name,
        email: userData.email,
        role: userData.type,
        isActive: true,
        password: appConfig.defaultPassword,
      } as unknown as User)
    ).unwrap();
    dispatch(fetchAllUsers());
    setAddUserDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    await dispatch(deleteUser(userToDelete)).unwrap();
    dispatch(fetchAllUsers());
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const getRoleChip = (type: "student" | "reviewer") => {
    const statusStyles = {
      reviewer: {
        bgcolor: "#EDEDFF",
        color: "#818CF8",
        label: "Reviewer",
      },
      student: {
        bgcolor: "#E2F5FF",
        color: "#59A8D4",
        label: "Student",
      },
      admin: {
        bgcolor: "#FEE9E1",
        color: "#F97316",
        label: "Admin",
      },
    };

    const style = statusStyles[type];
    if (!style) return null;

    return (
      <Chip
        label={style.label}
        sx={{
          bgcolor: style.bgcolor,
          color: style.color,
          height: "24px",
          fontSize: "0.75rem",
          fontWeight: 500,
          "& .MuiChip-label": { px: 1.5 },
        }}
      />
    );
  };

  // DataGrid columns configuration
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "User ID",
      flex: 1,
      headerClassName: "datagrid-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      headerClassName: "datagrid-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      headerClassName: "datagrid-header",
    },
    {
      field: "isActive",
      headerName: "Active",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          sx={{
            bgcolor: params.value ? "#ECFDF5" : "#FFEBEE",
            color: params.value ? "#34D399" : "#F97171",
            height: "24px",
            fontSize: "0.75rem",
            fontWeight: 500,
            "& .MuiChip-label": { px: 1.5 },
          }}
        />
      ),
    },
    {
      field: "role",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params) =>
        getRoleChip(params.value as "student" | "reviewer"),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "right",
      align: "right",
      headerClassName: "datagrid-header",
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            alignContent: "center",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id);
            }}
            sx={{
              color: (theme) => theme.palette.background.icon,
              "&:hover": { color: "error.main" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
            sx={{
              color: (theme) => theme.palette.background.icon,
              "&:hover": { color: "primary.main" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h4" fontWeight={500}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setAddUserDialogOpen(true)}
          sx={{ height: 40, borderRadius: 1, textTransform: "none" }}
        >
          Add User
        </Button>
      </Box>

      <Box
        sx={{
          height: "90%",
          "& .MuiDataGrid-root": { border: "none" },
          "& .datagrid-header": {
            bgcolor: "#fff",
            color: "text.secondary",
            fontWeight: 600,
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>

      {/* Dialogs */}
      <AddUserDialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        onSubmit={handleAddUser}
      />

      {selectedUser && (
        <UserEditDialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditSubmit}
          userData={selectedUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary" }}>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setUserToDelete(null);
            }}
            variant="outlined"
            sx={{ borderRadius: 1, textTransform: "none" }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            loading={loading}
            sx={{ borderRadius: 1, textTransform: "none" }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
