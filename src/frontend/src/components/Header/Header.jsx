import { useAuth } from "../../hooks/useAuth";
import classes from "./Header.module.css";
import { useDataCtx } from "../../hooks/useDataCtx";
import { useModalController } from "../../hooks/useModalController";

const Header = () => {
  const { logout, accessToken, userData } = useAuth();
  const { setData } = useDataCtx();
  const { openAddBookmark } = useModalController();

  // TODO: maybe I don't need to delete the data if I load it correctly at login?
  const handleLogout = () => {
    setData({ bookmarks: [], collections: [], tags: [] });
    logout();
  };

  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}>
          <h2>Delish</h2>
        </div>
        {accessToken && (
          <nav className={classes.nav}>
            <button onClick={openAddBookmark}>Add boomkark</button>
            <p>Bookmarks</p>
            <p>{userData.username}</p>
            <p onClick={handleLogout}>Logout</p>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
