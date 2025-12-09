import { useState } from 'react';

export default function Input({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    error = '',
    disabled = false,
    className = ''
}) {
    const [isFocused, setIsFocused] = useState(false);

    const inputStyles = {
        width: '100%',
        padding: 'var(--spacing-md)',
        fontSize: '1rem',
        fontFamily: 'Inter, sans-serif',
        border: `2px solid ${error ? 'var(--danger)' : isFocused ? 'var(--primary-500)' : 'var(--border-light)'}`,
        borderRadius: 'var(--radius-md)',
        backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
        color: 'var(--text-primary)',
        transition: 'all var(--transition-base)',
        outline: 'none'
    };

    const labelStyles = {
        display: 'block',
        marginBottom: 'var(--spacing-sm)',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: error ? 'var(--danger)' : 'var(--text-primary)'
    };

    const errorStyles = {
        marginTop: 'var(--spacing-xs)',
        fontSize: '0.875rem',
        color: 'var(--danger)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)'
    };

    return (
        <div className={className} style={{ marginBottom: 'var(--spacing-lg)' }}>
            {label && (
                <label htmlFor={name} style={labelStyles}>
                    {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                style={inputStyles}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {error && (
                <div style={errorStyles}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}
