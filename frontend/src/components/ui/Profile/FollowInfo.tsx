import { useNavigate, useParams } from "react-router-dom";
import PageNotFound from "../../../pages/PageNotFound";
import LabelledSelectorTabs from "../LabelledSelectorTabs";
import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { getFollowers, getFollowing } from "../../../api/api";

const FollowInfo = () => {
  const { username, followinfo } = useParams<{ username: string, followinfo: string }>();
  const navigate = useNavigate();

  const [followers, setFollowers] = useState<AppUser[]>([]);
  const [following, setFollowing] = useState<AppUser[]>([]);

  const tabs = [
    {
      tab: "following",
      tabName: "Following",
    },
    {
      tab: "followers",
      tabName: "Followers",
    },
  ];

  useEffect(() => {
    const fetchFollowers = async (username: string) => {
      getFollowers(username)
        .then((res) => {
          setFollowers(res.data);
        })
        .catch((error) => {
          console.error("Error fetching followers: ", error);
        });
    };

    const fetchFollowing = async (username: string) => {
      getFollowing(username)
        .then((res) => {
          setFollowing(res.data);
        })
        .catch((error) => {
          console.error("Error fetching followers: ", error);
        });
    };

    if (followinfo === "following" && username) {
      fetchFollowing(username);
    } else if (followinfo === "followers" && username) {
      fetchFollowers(username);
    }
  }, [followinfo, username]);

  if (followinfo !== "following" && followinfo !== "followers") {
    return <PageNotFound />;
  }

  return (
    <div>
      <LabelledSelectorTabs
        tabs={tabs}
        activeTab={followinfo}
        setActiveTab={(newtab) => navigate(`/${username}/${newtab}`)}
      />

      {followinfo === "followers" &&
        followers.map((follow) => (
          <ProfileCard key={follow.userId} user={follow} />
        ))}

      {followinfo === "following" &&
        following.map((follow) => (
          <ProfileCard key={follow.userId} user={follow} />
        ))}
    </div>
  );
};

export default FollowInfo;
