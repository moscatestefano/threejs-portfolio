export default function ScoreDisplay({ gameStore })
{
    const { score, highScore } = gameStore();
    
    return (
    <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: 'Arial',
    }}>
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
    </div>
    );
}