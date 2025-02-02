import { X, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoanDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanDetailsDialog({ open, onOpenChange }: LoanDetailsDialogProps) {
  const steps = [
    { label: "Eligibility checked", completed: true },
    { label: "Loan application", completed: true },
    { label: "Forwarded to Mudra", completed: true },
    { label: "LoanPass activated", completed: false },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Mudra Bank Loan Details
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="relative mt-8 flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step.completed ? 'bg-[#16ab13] text-white' : 'bg-[#f5eefa] text-[#752af0]'}`}>
                {step.completed ? <Check className="w-5 h-5" /> : null}
              </div>
              <p className="text-xs text-center mt-2 max-w-[80px]">{step.label}</p>
            </div>
          ))}
          {/* Connection line */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-[#f5eefa] -z-10" />
        </div>

        {/* Loan Details */}
        <div className="mt-8 bg-[#f5eefa] rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-[#752af0]">Approved limit</p>
              <p className="text-2xl font-bold">$ 300,000</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#752af0]">Interest rate</p>
              <p className="text-2xl font-bold">16%</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

