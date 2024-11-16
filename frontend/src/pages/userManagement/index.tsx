import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddUserDialog from "./components/AddUserDialog";
import UserEditDialog from "./components/UserEditDialog";
import Dialog, { DialogProps } from "@mui/material/Dialog";

// Define proper type for user data
interface User {
  id: string;
  name: string;
  email: string;
  dateCreated: string;
  type: "student" | "reviewer";
}

export const userData: User[] = [
  {
    id: "USR001",
    name: "John Smith",
    email: "john.smith@example.com",
    dateCreated: "2024-01-15",
    type: "student",
  },
  {
    id: "USR002",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@faculty.edu",
    dateCreated: "2024-01-10",
    type: "reviewer",
  },
  {
    id: "USR003",
    name: "Michael Chang",
    email: "michael.c@example.com",
    dateCreated: "2024-01-15",
    type: "student",
  },
  {
    id: "USR004",
    name: "Prof. David Wilson",
    email: "d.wilson@faculty.edu",
    dateCreated: "2024-01-12",
    type: "reviewer",
  },
  {
    id: "USR005",
    name: "Emma Davis",
    email: "emma.d@example.com",
    dateCreated: "2024-01-16",
    type: "student",
  },
  {
    id: "USR006",
    name: "Dr. Maria Garcia",
    email: "m.garcia@faculty.edu",
    dateCreated: "2024-01-11",
    type: "reviewer",
  },
  {
    id: "USR007",
    name: "James Wilson",
    email: "james.w@example.com",
    dateCreated: "2024-01-17",
    type: "student",
  },
  {
    id: "USR008",
    name: "Prof. Robert Brown",
    email: "r.brown@faculty.edu",
    dateCreated: "2024-01-13",
    type: "reviewer",
  },
  {
    id: "USR009",
    name: "Sophie Turner",
    email: "sophie.t@example.com",
    dateCreated: "2024-01-18",
    type: "student",
  },
  {
    id: "USR010",
    name: "Dr. Lisa Chen",
    email: "l.chen@faculty.edu",
    dateCreated: "2024-01-14",
    type: "reviewer",
  },
  {
    id: "USR011",
    name: "Daniel Lee",
    email: "daniel.l@example.com",
    dateCreated: "2024-01-19",
    type: "student",
  },
  {
    id: "USR012",
    name: "Emily White",
    email: "emily.w@example.com",
    dateCreated: "2024-01-20",
    type: "student",
  },
  {
    id: "USR013",
    name: "Prof. Thomas Anderson",
    email: "t.anderson@faculty.edu",
    dateCreated: "2024-01-15",
    type: "reviewer",
  },
];

const Users = () => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleEditUser = async (userData: {
    id: string;
    name: string;
    email: string;
    type: "student" | "reviewer";
  }) => {
    try {
      // API call to update user
      console.log("Updating user:", userData);
      // After successful update, you might want to refresh the data
      // setUserData(updatedData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlePasswordReset = async (userId: string) => {
    try {
      // API call to reset password
      console.log("Resetting password for user:", userId);
      // Show success message to user
    } catch (error) {
      console.error("Error resetting password:", error);
      // Show error message to user
    }
  };

  const handleAddUser = async (userData: {
    name: string;
    email: string;
    type: "student" | "reviewer";
  }) => {
    try {
      // API call to add user
      console.log("Adding user:", userData);
      // After successful addition, you might want to refresh the data
      // setUserData([...userData, newUser]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDelete = (id: string) => {
    const userToBeDeleted = userData.find((user) => user.id === id);
    if (userToBeDeleted) {
      setUserToDelete(id);
      setDeleteConfirmOpen(true);
    }
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
    };

    const style = statusStyles[type];

    return (
      <Chip
        label={style.label}
        sx={{
          bgcolor: style.bgcolor,
          color: style.color,
          height: "24px",
          fontSize: "0.75rem",
          fontWeight: 500,
          "& .MuiChip-label": {
            px: 1.5,
          },
        }}
      />
    );
  };

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
      field: "dateCreated",
      headerName: "Date Created",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      valueFormatter: (params: { value: string }) => {
        // Format date as needed
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params: GridRenderCellParams) => getRoleChip(params.value),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "right",
      align: "right",
      headerClassName: "datagrid-header",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            height: "100%",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "flex-end",
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
              "&:hover": {
                color: (theme) => theme.palette.error.main,
              },
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
              "&:hover": {
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h4">User Management</Typography>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{
            height: 40,
            borderRadius: 1,
            textTransform: "none",
            px: 2,
          }}
          onClick={() => setAddUserDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      <Box
        sx={{
          height: "100%",
          overflowY: "hidden",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .datagrid-header": {
            backgroundColor: "#fff",
            color: (theme) => theme.palette.background.icon,
            fontWeight: 600,
          },
        }}
      >
        <DataGrid
          rows={userData}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnMenu
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              sx: {
                p: 2,
                "& .MuiButtonBase-root": {
                  color: (theme) => theme.palette.background.icon,
                },
                "& .MuiFormControl-root": {
                  minWidth: 200,
                },
              },
            },
          }}
        />
      </Box>

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
          onSubmit={handleEditUser}
          onPasswordReset={handlePasswordReset}
          userData={selectedUser}
        />
      )}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            fontWeight: 600,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary" }}>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setUserToDelete(null);
            }}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Call your delete API here
              console.log("Deleting user:", userToDelete);
              // After successful deletion:
              // 1. Update your user list
              // 2. Show success message
              // 3. Close the dialog
              setDeleteConfirmOpen(false);
              setUserToDelete(null);
            }}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
