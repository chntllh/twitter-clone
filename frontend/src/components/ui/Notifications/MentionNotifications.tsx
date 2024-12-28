import { useEffect, useState } from "react";
import { getUserNotifications } from "../../../api/api";
import Posts from "../Post/Posts";

const MentionNotifications = () => {
  const [posts, setPosts] = useState<Tweet[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = () => {
      getUserNotifications()
        .then((res) => {
          if (isMounted) {
            setPosts(res.data);
          }
        })
        .catch((error) => {
          setPosts([]);
          console.error(error);
        });
    };
    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Posts posts={posts} />
    </div>
  );
};

export default MentionNotifications;
