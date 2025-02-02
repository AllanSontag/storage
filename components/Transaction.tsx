import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors } from "@/utils/colors"

interface TransactionProps {
  transaction: {
    id: number
    name: string
    date: string
    amount: number
    avatar: string
  }
}

export const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={transaction.avatar} alt={transaction.name} />
          <AvatarFallback>{transaction.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{transaction.name}</p>
          <p className={`text-sm text-[${colors.neutral[400]}]`}>{transaction.date}</p>
        </div>
      </div>
      <p className="font-semibold">${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  )
}

