import { useAuth } from "../../hooks/useAuth";
import classes from "./Header.module.css";

const Header = ({ openModal }) => {
  const { logout, accessToken, userData } = useAuth();

  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}>
          <h2>Delish</h2>
        </div>
        {accessToken && (
          <nav className={classes.nav}>
            <button onClick={openModal}>Add boomkark</button>
            <p>Bookmarks</p>
            <p>{userData.username}</p>
            <p onClick={logout}>Logout</p>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
