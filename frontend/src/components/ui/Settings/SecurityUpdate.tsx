import { useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput";
import { updateUser } from "../../../api/api";

const SecurityUpdate = () => {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [passwordError, setPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] =
    useState<string>("");

  const resetValues = () => {
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const validatePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("Passwords do not match");
      return false;
    }

    setNewPasswordError("");
    setPasswordError("");
    setConfirmNewPasswordError("");
    return true;
  };

  const handleSave = () => {
    if (validatePassword()) {
      updateUser({
        password: password,
        newPassword: newPassword,
      })
        .then(() => {
          resetValues();
        })
        .catch((error) => {
          const details = error.data.details;
          if (details.code === "INVALID_OLD_PASSWORD") {
            setPasswordError("Invalid password");
          } else if (details.code === "PASSWORD_REUSED") {
            setNewPasswordError(
              "Old password cannot be the same as old password"
            );
          } else if (details.code === "PASSWORD_TOO_SHORT") {
            setNewPasswordError("Password must be over 6 characters");
          }
        });
    }
  };

  return (
    <div className="p-4">
      <FloatingLabelInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
        error={passwordError}
      />
      <FloatingLabelInput
        id="newPassword"
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setNewPasswordError("");
        }}
        error={newPasswordError}
      />
      <FloatingLabelInput
        id="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        value={confirmNewPassword}
        onChange={(e) => {
          setConfirmNewPassword(e.target.value);
          setConfirmNewPasswordError("");
        }}
        error={confirmNewPasswordError}
      />

      <div className="flex justify-end">
        <button
          className="bg-blue-500 disabled:bg-blue-400 hover:bg-blue-600 disabled:cursor-not-allowed px-5 py-1 rounded-full"
          onClick={handleSave}
          disabled={
            !password ||
            !newPassword ||
            !confirmNewPassword ||
            !(passwordError === "") ||
            !(newPasswordError === "") ||
            !(confirmNewPasswordError === "")
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SecurityUpdate;
