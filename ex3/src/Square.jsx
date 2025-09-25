import './Square.css';

function Square({ color, onClick }) {
  const className = `square ${color}`;

  return (
    <div className={className} onClick={onClick}>
      {}
    </div>
  );
}

export default Square;