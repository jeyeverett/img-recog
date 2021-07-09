import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className="white f3">
        {`${name}, your current entry count is...`}
      </div>
      <div className="white f1">
        {typeof entries === 'string' ? `${entries}` : ''}
      </div>
    </div>
  );
};
export default Rank;
