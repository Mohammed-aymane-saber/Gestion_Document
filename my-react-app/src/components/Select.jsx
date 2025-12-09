import { useState } from 'react';

export default function Select({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    error = '',
    disabled = false,
    placeholder = 'Sélectionner...',
    className = ''
}) {
    const [isFocused, setIsFocused] = useState(false);

    const selectStyles = {
        width: '100%',
        padding: 'var(--spacing-md)',
        fontSize: '1rem',
        fontFamily: 'Inter, sans-serif',
        border: `2px solid ${error ? 'var(--danger)' : isFocused ? 'var(--primary-500)' : 'var(--border-light)'}`,
        borderRadius: 'var(--radius-md)',
        backgroundColor: disabled ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
        color: 'var(--text-primary)',
        transition: 'all var(--transition-base)',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer'
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
        color: 'var(--danger)'
    };

    return (
        <div className={className} style={{ marginBottom: 'var(--spacing-lg)' }}>
            {label && (
                <label htmlFor={name} style={labelStyles}>
                    {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                style={selectStyles}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div style={errorStyles}>{error}</div>}
        </div>
    );
}
