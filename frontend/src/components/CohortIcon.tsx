interface IconProps {
  className?: string
}

export function FoodIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 0-5 5c0 1.8.9 3.3 2.3 4.2L8 21h8l-1.3-9.8A5 5 0 0 0 17 7a5 5 0 0 0-5-5z" />
      <path d="M9 7h6" />
      <path d="M10 10h4" />
    </svg>
  )
}

export function ClimateIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12C12 12 7 10 7 5a5 5 0 0 1 10 0c0 5-5 7-5 7z" />
      <path d="M12 16c-2.5 0-5 1-5 3h10c0-2-2.5-3-5-3z" />
    </svg>
  )
}

export function HealthIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  )
}

export function EducationIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9l10-7 10 7-10 7-10-7z" />
      <path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
      <path d="M22 9v6" />
    </svg>
  )
}
