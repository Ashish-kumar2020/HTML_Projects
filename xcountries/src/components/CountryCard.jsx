const CountryCard = ({ country }) => {
  return (
    <div className="w-52 h-40 border-2 border-gray-300 rounded-lg flex flex-col justify-center items-center">
      <img
        src={country.flag}
        alt={country.abbr}
        className="w-20 h-20"
      />

      <h4 className="mt-2">{country.name}</h4>
    </div>
  );
};

export default CountryCard;