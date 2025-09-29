export default function ProjectileSelector({ selectedType, onSelect, shotsLeft, PROJECTILE_TYPES })
{
return (
    <div style={{
      position: 'absolute',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {Object.entries(PROJECTILE_TYPES).map(([type, props]) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          style={{
            padding: '10px',
            backgroundColor: selectedType === type ? '#4CAF50' : '#ffffff',
            color: selectedType === type ? 'white' : 'black',
            border: '2px solid #4CAF50',
            borderRadius: '5px',
            cursor: shotsLeft > 0 ? 'pointer' : 'not-allowed',
            opacity: shotsLeft > 0 ? 1 : 0.5
          }}
          disabled={shotsLeft <= 0}
        >
          {props.label}
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: props.color,
            borderRadius: '50%',
            margin: '5px auto 0'
          }} />
        </button>
      ))}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        Shots left: {shotsLeft}
      </div>
    </div>
  );
}