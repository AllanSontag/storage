import { Home, MessageCircle, Truck, Cog, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { colors } from "@/utils/colors"

export const BottomNavigation: React.FC = () => {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#3C096C] flex items-center justify-between px-6">
      <NavItem icon={<Home />} label="Home" onClick={() => router.push("/home")} />
      <NavItem icon={<MessageCircle />} label="Help" disabled="disabled" onClick={() => router.push("/help")} />
      <NavItem icon={<FileText />} label="Invoices" onClick={() => router.push("/invoices")} />
      <NavItem icon={<Truck />} label="Logistics" onClick={() => router.push("/logistics")} />
      <NavItem icon={<Cog />} label="Settings" onClick={() => router.push("/configuracoes")} />
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  isSpecial?: boolean
  onClick?: () => void
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, isSpecial, onClick }) => {
  const baseClass = `flex flex-col items-center gap-1 transition-colors text-white`
  const specialClass = `w-16 h-16 bg-[#240046] rounded-full -mt-8 flex flex-col items-center justify-center`

  return (
    <button
      className={`
        ${baseClass}
        ${isActive ? `text-white` : `text-white/70`}
        ${isSpecial ? specialClass : ""}
      `}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  )
}

