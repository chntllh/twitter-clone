import { useSelector } from "react-redux";
import FloatingLabelInput from "../FloatingLabelInput";
import { useState } from "react";

const InfoUpdate = () => {
  const { currentUser } = useSelector((state: RootState) => state.user) || {};

  const [username, setUsername] = useState<string>(currentUser.username);
  const [usernameError, setUsernameError] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>(
    currentUser.displayName
  );
  const [displayNameError, setDisplayNameError] = useState<string>("");

  return (
    <div className="p-4">
      <div className="mb-8">
        <FloatingLabelInput
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={usernameError}
        />
      </div>
      <div className="mb-8">
        <FloatingLabelInput
          id="displayName"
          label="Display Name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          error={displayNameError}
        />
      </div>
    </div>
  );
};

export default InfoUpdate;
