import { useSelector } from "react-redux";
import FloatingLabelInput from "../FloatingLabelInput";
import { useState } from "react";
import { updateUser } from "../../../api/api";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../../store/reducer/user.reducer";

const InfoUpdate = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state: RootState) => state.user) || {};

  const [username, setUsername] = useState<string>(currentUser.username);
  const [usernameError, setUsernameError] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>(
    currentUser.displayName
  );
  const [displayNameError, setDisplayNameError] = useState<string>("");

  const errorMessages = {
    USERNAME_LENGTH_ERROR: "Username must be between 3 and 16 characters.",
    USERNAME_WHITESPACE_ERROR: "Username cannot contain spaces.",
    USERNAME_ILLEGAL_CHARACTER_ERROR: "Username can only be alphanumeric.",
    USERNAME_EXISTS: "Username already exists.",
    NAME_LENGTH_ERROR: "Name must be between 1 and 50 characters.",
  } as const;

  const handleSave = () => {
    const updatePayload: Partial<AppUser> = {};

    if (username !== currentUser.username) updatePayload.username = username;

    if (displayName !== currentUser.displayName)
      updatePayload.displayName = displayName;

    updateUser(updatePayload)
      .then((res) => {
        dispatch(signInSuccess(res.data));
      })
      .catch((error) => {
        const details = error.data.details || {};
        const code = details.code as keyof typeof errorMessages;
        if (code && errorMessages[code]) {
          if (code.includes("USERNAME")) {
            setUsernameError(errorMessages[code]);
          } else if (code.includes("NAME")) {
            setDisplayNameError(errorMessages[code]);
          }
        }
      });
  };

  return (
    <div className="p-4">
      <FloatingLabelInput
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError("");
        }}
        error={usernameError}
      />
      <FloatingLabelInput
        id="displayName"
        label="Display Name"
        type="text"
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value);
          setDisplayNameError("");
        }}
        error={displayNameError}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-500 disabled:bg-blue-400 hover:bg-blue-600 disabled:cursor-not-allowed px-5 py-1 rounded-full"
          disabled={!(usernameError === "") || !(displayNameError === "")}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InfoUpdate;
