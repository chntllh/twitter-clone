import { useNavigate, useParams } from "react-router-dom";
import PageNotFound from "../../../pages/PageNotFound.jsx";
import LabelledSelectorTabs from "../LabelledSelectorTabs.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "./ProfileCard.jsx";

const FollowInfo = () => {
  const { username, followinfo } = useParams();
  const navigate = useNavigate();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

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
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`/api/follow/${username}/followers`);
        setFollowers(response.data);
      } catch (error) {
        console.error("Error fetching followers: ", error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`/api/follow/${username}/following`);
        setFollowing(response.data);
      } catch (error) {
        console.error("Error fetching following: ", error);
      }
    };

    if (followinfo === "following") {
      fetchFollowing();
    } else if (followinfo === "followers") {
      fetchFollowers();
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
