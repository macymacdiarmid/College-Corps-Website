interface IconProps {
  className?: string
}

export function FoodIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Apple body */}
      <path d="M12 6C10 6 7 7.5 7 12c0 4 2.5 7 5 7s5-3 5-7c0-4.5-3-6-5-6z" />
      {/* Stem */}
      <path d="M12 6 C12 4 13 3 14 2" />
      {/* Leaf */}
      <path d="M12 5 C13 4 15 4 15 5 C15 6 13 6 12 5z" />
    </svg>
  )
}

export function ClimateIcon({ className = 'w-12 h-12' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M12 22v-9" />
      {/* Left leaf sprouting */}
      <path d="M12 18 C11 16 8 15 6 16 C7 19 10 19 12 18z" />
      {/* Right leaf sprouting */}
      <path d="M12 13 C13 11 16 10 18 11 C17 14 14 14 12 13z" />
      {/* Ground */}
      <path d="M8 22h8" />
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
