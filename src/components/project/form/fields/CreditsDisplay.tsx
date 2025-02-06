interface CreditsDisplayProps {
  used: number
  limit: number
}

export function CreditsDisplay({ used, limit }: CreditsDisplayProps) {
  return (
    <span className="text-sm text-gray-500">
      {used}/{limit} credits used
    </span>
  )
}