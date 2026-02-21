import { FunctionComponent, useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import {
  deleteUserByAdmin,
  getAllUsersAdmin,
  getUserById,
  updateUser,
  updateUserByAdmin,
} from "../services/userService";
import { getAllCards } from "../services/RecipeService";

interface CardInterface {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  isLiked?: boolean;
}

interface UserProfilePageProps {}

interface AdminUserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

const UserProfilePage: FunctionComponent<UserProfilePageProps> = () => {
  const { userId } = useAuth();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImg, setProfileImg] = useState<string>(
    localStorage.getItem("profileImg") || "",
  );
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [likedCards, setLikedCards] = useState<CardInterface[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [pwMode, setPwMode] = useState(false);
  const [pwValues, setPwValues] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUserInterface[]>([]);
  const [editingAdminUserId, setEditingAdminUserId] = useState<string>("");
  const [adminEditValues, setAdminEditValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const loadAdminUsers = async () => {
    try {
      const res = await getAllUsersAdmin();
      const usersData = Array.isArray(res.data) ? res.data : [];
      const normalized = usersData.map((item: any) => ({
        _id: String(item._id || ""),
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        email: item.email || "",
        isAdmin: Boolean(item.isAdmin),
      }));
      setAdminUsers(normalized);
    } catch (err: any) {
      toast.error(err?.response?.data || "Failed to load users.");
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: { isAdmin?: boolean } = jwtDecode(token);
        setIsAdmin(Boolean(decoded?.isAdmin));
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }

    if (!userId) return;
    getUserById()
      .then((res: any) => {
        const u = res.data;
        setUser({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
        });
        setEditValues({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
        });
      })
      .catch(() => {});

    getAllCards()
      .then((res: any) => {
        const all: CardInterface[] = (
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.cards)
              ? res.data.cards
              : []
        ).map((item: any) => ({
          _id: String(item._id || item.id),
          title: item.title || "Untitled",
          description: item.description || "",
          imageUrl: item.imageUrl || item.image?.url || "",
          isLiked: item.isLiked,
        }));
        setLikedCards(all.filter((c) => c.isLiked));
      })
      .catch(() => {});

    if (localStorage.getItem("token")) {
      try {
        const decoded: { isAdmin?: boolean } = jwtDecode(
          localStorage.getItem("token") || "",
        );
        if (decoded?.isAdmin) {
          loadAdminUsers();
        }
      } catch {}
    }
  }, [userId, location]);

  const startAdminEdit = (adminUser: AdminUserInterface) => {
    setEditingAdminUserId(adminUser._id);
    setAdminEditValues({
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
    });
  };

  const saveAdminEdit = async () => {
    if (!editingAdminUserId) return;

    try {
      await updateUserByAdmin(editingAdminUserId, {
        firstName: adminEditValues.firstName,
        lastName: adminEditValues.lastName,
        email: adminEditValues.email,
      });
      toast.success("User updated.");
      setEditingAdminUserId("");
      await loadAdminUsers();
    } catch (err: any) {
      toast.error(err?.response?.data || "Failed to update user.");
    }
  };

  const removeAdminUser = async (adminUserId: string) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      await deleteUserByAdmin(adminUserId);
      toast.success("User deleted.");
      await loadAdminUsers();
    } catch (err: any) {
      toast.error(err?.response?.data || "Failed to delete user.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        const ratio = Math.min(MAX / img.width, MAX / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas
          .getContext("2d")!
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        setProfileImg(compressed);
        try {
          localStorage.removeItem("profileImg");
          localStorage.setItem("profileImg", compressed);
        } catch {
          // still show the photo in-session even if storage is full
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleEditSave = async () => {
    try {
      const uid = localStorage.getItem("userId") || "";
      await updateUser(uid, {
        id: 0,
        firstName: editValues.firstName,
        lastName: editValues.lastName,
        email: editValues.email,
        password: "",
      });
      // Re-fetch from server to confirm the saved data
      const res = await getUserById();
      const u = res.data;
      const updated = {
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
      };
      setUser(updated);
      setEditValues(updated);
      setEditMode(false);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err?.response?.data || "Failed to save profile.");
    }
  };

  const handlePasswordSave = () => {
    setPwError("");
    setPwSuccess("");
    if (!pwValues.current) {
      setPwError("Please enter your current password.");
      return;
    }
    if (pwValues.next.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (pwValues.next !== pwValues.confirm) {
      setPwError("Passwords do not match.");
      return;
    }

    setPwSuccess("Password updated successfully!");
    setPwValues({ current: "", next: "", confirm: "" });
    setTimeout(() => {
      setPwMode(false);
      setPwSuccess("");
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="container py-5">
        <h2
          className="text-center mb-5 fw-bold"
          style={{ color: "#5F9598", letterSpacing: "1px" }}
        >
          My Profile
        </h2>
        {/* Profile card */}
        <div
          className="card shadow mx-auto mb-5"
          style={{
            maxWidth: "680px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: "#1D546D", height: "90px" }} />

          <div className="text-center" style={{ marginTop: "-55px" }}>
            <div className="position-relative d-inline-block">
              <img
                src={
                  profileImg ||
                  `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=110&background=1D546D&color=fff&bold=true`
                }
                alt="Profile"
                className="rounded-circle border border-4 border-white shadow"
                style={{ width: "110px", height: "110px", objectFit: "cover" }}
              />
              <button
                className="btn btn-sm rounded-circle position-absolute bottom-0 end-0"
                style={{
                  backgroundColor: "#5F9598",
                  color: "#fff",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                  border: "2px solid white",
                }}
                title="Change photo"
                onClick={() => fileInputRef.current?.click()}
              >
                <i
                  className="fa-solid fa-camera"
                  style={{ fontSize: "0.75rem" }}
                ></i>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="card-body px-5 pb-4">
            {!editMode ? (
              <div className="text-center">
                <h4 className="fw-bold mt-2" style={{ color: "#061E29" }}>
                  {user ? `${user.firstName} ${user.lastName}` : "—"}
                </h4>
                <p className="text-muted mb-1">{user?.email}</p>
                <button
                  className="btn btn-sm mt-3"
                  style={{
                    backgroundColor: "#1D546D",
                    color: "#F3F4F4",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  onClick={() => setEditMode(true)}
                >
                  <i className="fa-regular fa-pen-to-square me-2"></i>Edit
                  Profile
                </button>
                <button
                  className="btn btn-sm mt-3 ms-2"
                  style={{
                    backgroundColor: "#5F9598",
                    color: "#F3F4F4",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  onClick={() => setPwMode((v) => !v)}
                >
                  <i className="fa-solid fa-lock me-2"></i>Change Password
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      First Name
                    </label>
                    <input
                      className="form-control"
                      value={editValues.firstName}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      Last Name
                    </label>
                    <input
                      className="form-control"
                      value={editValues.lastName}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Email
                    </label>
                    <input
                      className="form-control"
                      value={editValues.email}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, email: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm flex-fill"
                    style={{
                      backgroundColor: "#1D546D",
                      color: "#F3F4F4",
                      border: "none",
                    }}
                    onClick={handleEditSave}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary flex-fill"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Change Password */}
            {pwMode && !editMode && (
              <div className="mt-4 border-top pt-3">
                <h6 className="fw-semibold mb-3" style={{ color: "#1D546D" }}>
                  <i className="fa-solid fa-lock me-2"></i>Change Password
                </h6>
                {pwError && (
                  <div className="alert alert-danger py-2 small">{pwError}</div>
                )}
                {pwSuccess && (
                  <div className="alert alert-success py-2 small">
                    {pwSuccess}
                  </div>
                )}
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••"
                      value={pwValues.current}
                      onChange={(e) =>
                        setPwValues((v) => ({ ...v, current: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••"
                      value={pwValues.next}
                      onChange={(e) =>
                        setPwValues((v) => ({ ...v, next: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••"
                      value={pwValues.confirm}
                      onChange={(e) =>
                        setPwValues((v) => ({ ...v, confirm: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-sm flex-fill"
                    style={{
                      backgroundColor: "#5F9598",
                      color: "#F3F4F4",
                      border: "none",
                    }}
                    onClick={handlePasswordSave}
                  >
                    Update Password
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary flex-fill"
                    onClick={() => {
                      setPwMode(false);
                      setPwError("");
                      setPwValues({ current: "", next: "", confirm: "" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Liked recipes */}
        <h4 className="fw-bold mb-4 text-center" style={{ color: "#5F9598" }}>
          <i className="fa-solid fa-heart text-danger me-2"></i>My Favorite
          Recipes
        </h4>

        {likedCards.length ? (
          <div className="row">
            {likedCards.map((card) => (
              <div className="col-md-4 mb-4 px-3" key={card._id}>
                <Card className="h-100 shadow">
                  <Card.Img
                    variant="top"
                    src={card.imageUrl}
                    alt={card.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{card.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {card.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 text-end">
                    <i
                      className="fa-solid fa-heart text-danger"
                      style={{ fontSize: "1.3rem" }}
                    ></i>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center" style={{ color: "#DCE7EA" }}>
            No liked recipes yet. Start exploring and hit the{" "}
            <i className="fa-regular fa-heart text-danger"></i> on recipes you
            love!
          </p>
        )}

        {isAdmin && (
          <div className="mt-5">
            <h4
              className="fw-bold mb-3 text-center"
              style={{ color: "#5F9598" }}
            >
              <i className="fa-solid fa-users me-2"></i>Admin - All Users
            </h4>

            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((adminUser) => {
                    const isEditing = editingAdminUserId === adminUser._id;

                    return (
                      <tr key={adminUser._id}>
                        <td>
                          {isEditing ? (
                            <input
                              className="form-control form-control-sm"
                              value={adminEditValues.firstName}
                              onChange={(e) =>
                                setAdminEditValues((v) => ({
                                  ...v,
                                  firstName: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            adminUser.firstName
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="form-control form-control-sm"
                              value={adminEditValues.lastName}
                              onChange={(e) =>
                                setAdminEditValues((v) => ({
                                  ...v,
                                  lastName: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            adminUser.lastName
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="form-control form-control-sm"
                              value={adminEditValues.email}
                              onChange={(e) =>
                                setAdminEditValues((v) => ({
                                  ...v,
                                  email: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            adminUser.email
                          )}
                        </td>
                        <td>{adminUser.isAdmin ? "Admin" : "User"}</td>
                        <td className="text-end">
                          {isEditing ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={saveAdminEdit}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingAdminUserId("")}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => startAdminEdit(adminUser)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeAdminUser(adminUser._id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
