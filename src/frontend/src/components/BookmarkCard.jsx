import classes from "./BookmarkCard.module.css";
import { getRelativeTimeString } from "../utils/timeConversion";
import { truncateString } from "../utils/truncateString";

const BookmarkCard = ({
  fetchBookmarks,
  title,
  favicon,
  description,
  note,
  // is_unread,
  // is_archived,
  collection,
  tags,
  timestamp,
  url,
}) => {
  const titleTrimmed = truncateString(title, 100);
  const descTrimmed = truncateString(description, 150);
  const dateApprox = getRelativeTimeString(new Date(timestamp));

  const handleClickCollection = (value) => {
    fetchBookmarks("collection", value);
  };

  const handleClickTag = (value) => {
    fetchBookmarks("tag", value);
  };

  return (
    <div className={classes.card}>
      <img className={classes.favicon} src={favicon} alt="url favicon" />
      <a className={classes.title} href={url}>
        {titleTrimmed}
      </a>
      <p className={classes.description}>{descTrimmed}</p>
      {note && <p className={classes.note}>Note: {note}</p>}
      <p
        className={classes.collection}
        onClick={() => handleClickCollection(collection)}
      >
        {collection}
      </p>
      {tags && (
        <div>
          {tags.map((tag) => (
            <p
              key={tag.id}
              className={classes.tags}
              onClick={() => handleClickTag(tag.name)}
            >
              {"#" + tag.name}
            </p>
          ))}
        </div>
      )}
      <p className={classes.timestamp}>{dateApprox}</p>
    </div>
  );
};

export default BookmarkCard;
