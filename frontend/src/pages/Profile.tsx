import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ui/Profile/ProfileHeader";
import { useEffect, useState } from "react";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs";
import { getUser, getUserTweets } from "../api/api";
import Posts from "../components/ui/Post/Posts";

const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user) || {};
  const { username } = useParams<{ username: string | undefined }>();

  const [user, setUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>("tweets");
  const [posts, setPosts] = useState<Tweet[]>([]);

  const tabs: LabelledSelectorTab[] = [
    {
      tab: "tweets",
      tabName: "Tweets",
    },
    {
      tab: "replies",
      tabName: "Replies",
    },
    {
      tab: "media",
      tabName: "Media",
    },
    {
      tab: "likes",
      tabName: "Likes",
    },
  ];

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    const fetchUserPosts = (userId: string) => {
      getUserTweets(userId)
        .then((res) => {
          setPosts(res.data as Tweet[]);
        })
        .catch((error) => {
          console.error("Error fetching posts: ", error);
        });
    };

    const fetchUser = (userName: string) => {
      getUser(userName)
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          if (error.response && error.response.data.statusCode === 404) {
            setUser(null);
          } else {
            console.error(error);
          }
        });
    };

    if (typeof username === "string" && user === null) {
      fetchUser(username);
    }
    if (user) {
      fetchUserPosts(user.userId);
    }
  }, [username, user]);

  return (
    <div>
      <ProfileHeader user={user} isOwner={isOwner} />

      {user !== null && (
        <div>
          <LabelledSelectorTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div>{activeTab === "tweets" && <Posts posts={posts} />}</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
