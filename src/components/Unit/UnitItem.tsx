import PropTypes from "prop-types";

interface UnitData {
  address: string;
}

interface UnitItemProps {
  data: UnitData;
}

function UnitItem({ data }: UnitItemProps) {
  return (
    <div className="wrapper">
      <span className="address">{data.address}</span>
    </div>
  );
}

UnitItem.propTypes = {
  data: PropTypes.shape({
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default UnitItem;
