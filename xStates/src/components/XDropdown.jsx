const XDropdown = ({
  list,
  selectedList,
  changeList,
  title,
  disabled,
}) => {
  return (
    <div>
      <select
        value={selectedList}
        disabled={disabled}
        onChange={(e) => changeList(e.target.value)}
        className="block w-full max-w-xs px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="" disabled>
          Select a {title}
        </option>

        {list.map((val) => (
          <option value={val} key={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
};

export default XDropdown;