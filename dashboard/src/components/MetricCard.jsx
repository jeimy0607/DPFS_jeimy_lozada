const MetricCard = ({ title, value }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '8px'
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {value}
      </p>
    </div>
  );
};

export default MetricCard;
