import { useAuth } from "../hooks/useAuth";
import ButtonAddBookmark from "./ButtonAddBookmark";
import classes from "./Header.module.css";

const Header = () => {
  const { logout, accessToken, userData } = useAuth();

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <h2>Delish</h2>
      </div>
      {accessToken && (
        <nav className={classes.nav}>
          <ButtonAddBookmark />
          <p>Bookmarks</p>
          <p>{userData.username}</p>
          <p onClick={logout}>Logout</p>
        </nav>
      )}
    </header>
  );
};

export default Header;
