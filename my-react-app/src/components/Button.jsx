import '../index.css'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false,
    fullWidth = false,
    className = ''
}) {
    const baseStyles = `
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    ${fullWidth ? 'width: 100%;' : ''}
  `;

    const variants = {
        primary: `
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      color: var(--text-white);
      box-shadow: var(--shadow-md);
    `,
        secondary: `
      background: var(--bg-primary);
      color: var(--primary-600);
      border: 2px solid var(--primary-600);
    `,
        danger: `
      background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
      color: var(--text-white);
      box-shadow: var(--shadow-md);
    `,
        ghost: `
      background: transparent;
      color: var(--primary-600);
      border: 1px solid var(--border-light);
    `
    };

    const sizes = {
        sm: 'padding: var(--spacing-sm) var(--spacing-md); font-size: 0.875rem;',
        md: 'padding: var(--spacing-md) var(--spacing-xl); font-size: 1rem;',
        lg: 'padding: var(--spacing-lg) var(--spacing-2xl); font-size: 1.125rem;'
    };

    const hoverStyles = {
        primary: 'transform: translateY(-2px); box-shadow: var(--shadow-lg);',
        secondary: 'background: var(--primary-50);',
        danger: 'transform: translateY(-2px); box-shadow: var(--shadow-lg);',
        ghost: 'background: var(--bg-secondary);'
    };

    const disabledStyles = disabled ? `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  ` : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={{
                ...Object.fromEntries(
                    (baseStyles + variants[variant] + sizes[size] + disabledStyles)
                        .split(';')
                        .filter(s => s.trim())
                        .map(s => {
                            const [key, value] = s.split(':').map(str => str.trim());
                            return [
                                key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
                                value
                            ];
                        })
                )
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    Object.assign(e.target.style,
                        Object.fromEntries(
                            hoverStyles[variant]
                                .split(';')
                                .filter(s => s.trim())
                                .map(s => {
                                    const [key, value] = s.split(':').map(str => str.trim());
                                    return [
                                        key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
                                        value
                                    ];
                                })
                        )
                    );
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = variant === 'primary' || variant === 'danger'
                        ? 'var(--shadow-md)'
                        : '';
                    if (variant === 'secondary' || variant === 'ghost') {
                        e.target.style.background = variant === 'secondary' ? 'var(--bg-primary)' : 'transparent';
                    }
                }
            }}
        >
            {children}
        </button>
    );
}
