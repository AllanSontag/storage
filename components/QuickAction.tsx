import { colors } from "@/utils/colors"

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  isMore?: boolean
}

export const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onClick, isMore }) => {

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
      <div className={`w-14 h-14 rounded-2xl ${isMore ? 'border-2 border-dashed border-white/30' : 'bg-[#240046]'} flex items-center justify-center`}>
        {}
      </div>
      <span className="text-xs text-center">{label}</span>
    </button>
  )
}

