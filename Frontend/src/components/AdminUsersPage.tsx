import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getAllUsersAdmin,
  deleteUserByAdmin,
  updateUserByAdmin,
} from "../services/userService";
import User from "../interfaces/User";

// Helper interface to match MongoDB response structure //
interface UserData extends Omit<User, "id"> {
  _id: string;
}

const AdminUsersPage = () => {
  // List of all users loaded from the server //
  const [users, setUsers] = useState<UserData[]>([]);
  // Controls visibility of the edit and create modals //
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Holds the user currently being edited //
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Shared form state used by both the edit and create modals //
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Added password for creation
    isAdmin: false,
  });

  // Fetch users once when the component first mounts //
  useEffect(() => {
    fetchUsers();
  }, []);

  // Load all users from the admin API and store them in state //
  const fetchUsers = async () => {
    try {
      const res = await getAllUsersAdmin();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  // Ask for confirmation before permanently deleting a user //
  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserByAdmin(userId);
        toast.success("User deleted successfully (V)");
        fetchUsers();
      } catch (err) {
        toast.error("Failed to delete user (X)");
      }
    }
  };

  // Pre-fill the form with the selected user's data and open the edit modal //
  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // Reset password field so we don't accidentally overwrite it //
      isAdmin: user.isAdmin || false,
    });
    setShowEditModal(true);
  };

  // Clear the form and open the create modal //
  const handleCreateClick = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isAdmin: false,
    });
    setShowCreateModal(true);
  };

  // Submit the create form; admin role cannot be set at creation time via the current API //
  const handleCreate = async () => {
    try {
      await import("../services/userService").then((service) =>
        service.addUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        } as any),
      );

      toast.success("User created successfully");
      setShowCreateModal(false);
      fetchUsers();

      if (formData.isAdmin) {
        toast.info("Please edit the new user to grant Admin privileges.");
      }
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to create user");
    }
  };

  // Submit the edit form; password is sent only if the admin typed a new one //
  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await updateUserByAdmin(editingUser._id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password || undefined, // Omit password if field was left empty //
        isAdmin: formData.isAdmin,
      });
      toast.success("User updated successfully");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard - Manage Users</h2>
        <Button variant="success" onClick={handleCreateClick}>
          <i className="fa-solid fa-plus me-2"></i> Create New User
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? (
                  <span className="badge bg-danger">Admin</span>
                ) : (
                  <span className="badge bg-primary">User</span>
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password (Leave empty to keep current)</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Is Admin?"
                checked={formData.isAdmin}
                onChange={(e) =>
                  setFormData({ ...formData, isAdmin: e.target.checked })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>
            {/* Note: Cannot set admin on create with current API without extra steps, limiting for now */}
            <div className="text-muted small">
              * Provide valid details. You can assign Admin role after creation.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleCreate}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
