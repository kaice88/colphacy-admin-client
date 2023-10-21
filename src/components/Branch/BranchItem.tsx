import PropTypes from "prop-types";

interface BranchData {
  address: string;
}

interface BranchItemProps {
  data: BranchData;
}

function BranchItem({ data }: BranchItemProps) {
  return (
    <div className="wrapper">
      <span className="address">{data.address}</span>
    </div>
  );
}

BranchItem.propTypes = {
  data: PropTypes.shape({
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default BranchItem;
