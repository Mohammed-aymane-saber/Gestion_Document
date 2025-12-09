export default function Card({ children, className = '', hover = true, glass = false }) {
    const cardStyles = {
        background: glass ? 'var(--glass-bg)' : 'var(--bg-primary)',
        backdropFilter: glass ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: glass ? 'blur(10px)' : 'none',
        border: glass ? '1px solid var(--glass-border)' : 'none',
        borderRadius: 'var(--radius-lg)',
        boxShadow: glass ? 'var(--glass-shadow)' : 'var(--shadow-md)',
        padding: 'var(--spacing-xl)',
        transition: 'all var(--transition-base)',
        cursor: hover ? 'default' : 'default'
    };

    return (
        <div
            className={`card ${className}`}
            style={cardStyles}
            onMouseEnter={(e) => {
                if (hover) {
                    e.currentTarget.style.boxShadow = glass ? 'var(--glass-shadow)' : 'var(--shadow-lg)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                }
            }}
            onMouseLeave={(e) => {
                if (hover) {
                    e.currentTarget.style.boxShadow = glass ? 'var(--glass-shadow)' : 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            {children}
        </div>
    );
}
