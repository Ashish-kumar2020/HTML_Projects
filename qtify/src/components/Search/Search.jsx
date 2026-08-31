import styles from "./Search.module.css";
import SearchIcon from "../../assets/search-icon.svg";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import { styled } from "@mui/system";
import { truncate } from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";

const Listbox = styled("ul")(() => ({
  width: "100%",
  margin: 0,
  padding: 0,
  position: "absolute",
  borderRadius: "0px 0px 10px 10px",
  border: "1px solid var(--color-primary)",
  top: 60,
  maxHeight: "500px",
  zIndex: 10,
  overflow: "auto",
  left: 0,
  listStyle: "none",
  backgroundColor: "var(--color-black)",

  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },

  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

function Search({ searchData = [], placeholder }) {
  const {
    getRootProps,
    value,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: searchData,
    getOptionLabel: (option) => option?.title || "",
  });

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!value) return;

    navigate(`/album/${value.slug}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <form
        className={styles.wrapper}
        onSubmit={onSubmit}
      >
        <div {...getRootProps()}>
          <input
            name="album"
            className={styles.search}
            placeholder={placeholder}
            {...getInputProps()}
          />
        </div>

        <button
          className={styles.searchButton}
          type="submit"
        >
          <img src={SearchIcon} alt="Search" />
        </button>
      </form>

      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            let subtitle = "";

            // Album
            if (option.songs) {
              const artists = option.songs.flatMap(
                (song) => song.artists || []
              );

              subtitle = truncate(
                [...new Set(artists)].join(", "),
                40
              );
            }

            // Song
            else if (option.artists) {
              subtitle = truncate(
                option.artists.join(", "),
                40
              );
            }

            const { key, ...optionProps } = getOptionProps({
              option,
              index,
            });

            return (
              <li
                key={key}
                className={styles.listElement}
                {...optionProps}
              >
                <div>
                  <p className={styles.albumTitle}>
                    {option.title}
                  </p>

                  {subtitle && (
                    <p className={styles.albumArtists}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </Listbox>
      )}
    </div>
  );
}

export default Search;