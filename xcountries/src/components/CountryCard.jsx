const CountryCard = ({ country }) => {
  return (
    <div className="countryCard w-52 h-40 border-2 border-gray-300 rounded-lg flex flex-col justify-center items-center">
      <img
        src={country.png}
        alt={country.common}
        className="w-20 h-20"
      />

      <h4 className="mt-2">{country.common}</h4>
    </div>
  );
};

export default CountryCard;