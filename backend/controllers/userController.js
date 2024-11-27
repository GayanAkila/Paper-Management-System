const { auth, db } = require("../firebase/firebaseConfig");

// @route   GET /api/v1/users/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
};

// @route   PUT /api/v1/users/me
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    await auth.updateUser(req.user.uid, {
      displayName: name || userDoc.data().name,
      email: email || userDoc.data().email,
    });

    await userRef.update({
      name: name || userDoc.data().name,
      email: email || userDoc.data().email,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile." });
  }
};

// @route   PUT /api/v1/users/:uid
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { role, isActive } = req.body;
  const { uid } = req.params;
  console.log(role, isActive);
  try {
    console.log("A");
    await auth.setCustomUserClaims(uid, { role, isActive });
    console.log("B");
    await db.collection("users").doc(uid).update({ role, isActive });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/v1/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "admin", "reviewer"];
  if (!role || !allowedRoles.includes(role)) {
    return res
      .status(400)
      .json({
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
      });
  }

  try {
    await auth.setCustomUserClaims(id, { role });

    const userRef = db.collection("users").doc(id);
    await userRef.update({ role });

    res.status(200).json({ message: "User role updated successfully." });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role." });
  }
};

// @route   PUT /api/v1/users/:id/deactivate
// @access  Private (Admin only)
exports.deactivateUser = async (req, res) => {
  const { id } = req.params;

  try {
    await auth.setCustomUserClaims(id, { isActive: false });

    const userRef = db.collection("users").doc(id);
    await userRef.update({ isActive: false });

    res.status(200).json({ message: "User deactivated successfully." });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ message: "Failed to deactivate user." });
  }
};
