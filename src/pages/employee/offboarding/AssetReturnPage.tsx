import { Package } from 'lucide-react'
import OffboardingPlaceholder from './OffboardingPlaceholder'

export default function AssetReturnPage() {
  return (
    <OffboardingPlaceholder
      title="Asset Return"
      subtitle="Return the company assets assigned to you (reuses the existing Asset Return flow)."
      Icon={Package}
    />
  )
}
