"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { useTheme } from "@/contexts/ThemeContext"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/useToast"

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface Invoice {
  id: number
  invoice_number: string
  date: string
  device_quantity: number
  status: "paid" | "pending" | "overdue" | "preparing for shipment"
  amount: number
  dollar_amount: number
  shipping_location?: string
}

interface ShippingLocation {
  id: number
  name: string
}

export default function InvoicesPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { showToast } = useToast()

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [shippingLocations, setShippingLocations] = useState<ShippingLocation[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [shippingLocation, setShippingLocation] = useState("")
  const [invoiceStatus, setInvoiceStatus] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmedInvoicesTotal, setConfirmedInvoicesTotal] = useState(0)
  const [expensesTotal, setExpensesTotal] = useState(0)

  useEffect(() => {
    fetchInvoices()
    fetchShippingLocations()
    fetchConfirmedInvoices()
    fetchExpenses()
  }, [])

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("invoice_details").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching invoices:", error)
      showToast("Failed to fetch invoices", "error")
    } else {
      setInvoices(data)
    }
  }

  const fetchShippingLocations = async () => {
    const { data, error } = await supabase.from("shipping_locations").select("*")

    if (error) {
      console.error("Error fetching shipping locations:", error)
      showToast("Failed to fetch shipping locations", "error")
    } else {
      setShippingLocations(data)
    }
  }

  const fetchConfirmedInvoices = async () => {
    const { data, error } = await supabase.from("invoice_details").select("amount").eq("status", "paid")

    if (error) {
      console.error("Error fetching confirmed invoices:", error)
      showToast("Failed to fetch confirmed invoices", "error")
    } else {
      const total = data.reduce((sum, invoice) => sum + invoice.amount, 0)
      setConfirmedInvoicesTotal(total)
    }
  }

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("transactions").select("amount").eq("type", "outgoing")

    if (error) {
      console.error("Error fetching expenses:", error)
      showToast("Failed to fetch expenses", "error")
    } else {
      const total = data.reduce((sum, transaction) => sum + transaction.amount, 0)
      setExpensesTotal(total)
    }
  }

  const totalUnpaidInvoices = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((total, invoice) => total + invoice.amount, 0)

  useEffect(() => {
    if (isDialogOpen && selectedInvoice) {
      setShippingLocation(selectedInvoice.shipping_location || "")
      setInvoiceStatus("")
      setDollarExchangeRate(selectedInvoice.amount / selectedInvoice.dollar_amount)
    }
  }, [isDialogOpen, selectedInvoice])

  const handleStatusChange = (status: string) => {
    if (status === "send" && shippingLocation) {
      setIsConfirmDialogOpen(true)
    } else {
      setInvoiceStatus(status)
    }
  }

  const handleSaveChanges = async () => {
    if (selectedInvoice) {
      const updatedInvoice = {
        ...selectedInvoice,
        status:
          invoiceStatus === "pay"
            ? "paid"
            : invoiceStatus === "send"
              ? "preparing for shipment"
              : selectedInvoice.status,
        shipping_location: shippingLocation,
        dollar_amount: selectedInvoice.amount / dollarExchangeRate,
      }

      const { error } = await supabase
        .from("invoices")
        .update({
          status: updatedInvoice.status,
          shipping_location_id: shippingLocations.find((loc) => loc.name === shippingLocation)?.id,
          dollar_amount: updatedInvoice.dollar_amount,
        })
        .eq("id", selectedInvoice.id)

      if (error) {
        console.error("Error updating invoice:", error)
        showToast("Failed to update invoice", "error")
      } else {
        showToast("Invoice updated successfully", "success")
        fetchInvoices()
      }

      setIsDialogOpen(false)
    }
  }

  const [dollarExchangeRate, setDollarExchangeRate] = useState<number>(1)

  return (
    <div
      className={`min-h-screen ${
        theme === "light" ? "bg-gradient-to-b from-[#F65C47] to-[#3E005B] text-white" : "bg-[#10002B] text-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold">Invoice</h1>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="mx-6 p-8 bg-[#3C096C] rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#240046] rounded-2xl p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#1a2175] flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-[#0077fe]" />
              </div>
              <span className="text-lg text-gray-400">Available for Purchase</span>
            </div>
            <p className="text-3xl font-semibold">${formatNumber(confirmedInvoicesTotal - expensesTotal)}</p>
          </div>
          <div className="bg-[#240046] rounded-2xl p-6 flex flex-col justify-between h-40">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#1a2175] flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-[#e46962]" />
              </div>
              <span className="text-lg text-gray-400">Unpaid Invoices</span>
            </div>
            <p className="text-3xl font-semibold">${formatNumber(totalUnpaidInvoices)}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <button className="text-[#e46962]">Detail report</button>
        </div>

        {/* Time Period Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-[#3C096C] rounded-full text-sm font-medium whitespace-nowrap">
            This Day
          </button>
          <button className="px-6 py-3 bg-[#240046] rounded-full text-sm font-medium whitespace-nowrap">
            This Week
          </button>
          <button className="px-6 py-3 bg-[#240046] rounded-full text-sm font-medium whitespace-nowrap">
            This Month
          </button>
          <button className="px-6 py-3 bg-[#240046] rounded-full text-sm font-medium whitespace-nowrap">6 Month</button>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-[#3C096C] rounded-xl cursor-pointer hover:bg-[#4B0082] transition-colors"
              onClick={() => {
                setSelectedInvoice(invoice)
                setShippingLocation(invoice.shipping_location || "")
                setInvoiceStatus("")
                setIsDialogOpen(true)
              }}
            >
              <div className="flex-1">
                <p className="font-semibold">{invoice.invoice_number}</p>
                <p className="text-sm text-[#6d7589]">Date: {invoice.date}</p>
                <p className="text-sm text-[#6d7589]">Devices: {invoice.device_quantity}</p>
                <p className="text-sm text-[#6d7589]">Shipping: {invoice.shipping_location || "Not set"}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold">USD ${formatNumber(invoice.amount)}</p>
                <p className="text-sm text-[#6d7589]">$ {formatNumber(invoice.dollar_amount)}</p>
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    invoice.status === "paid"
                      ? "bg-green-500 text-white"
                      : invoice.status === "pending"
                        ? "bg-yellow-500 text-black"
                        : invoice.status === "preparing for shipment"
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#240046] text-white">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-medium">Invoice:</p>
                <p className="col-span-3">{selectedInvoice.invoice_number}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-medium">Date:</p>
                <p className="col-span-3">{selectedInvoice.date}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-medium">Amount:</p>
                <p className="col-span-3">${formatNumber(selectedInvoice.amount)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-medium">Status:</p>
                <p className="col-span-3">{selectedInvoice.status}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="shipping" className="text-right">
                  Shipping:
                </label>
                <Select onValueChange={setShippingLocation} value={shippingLocation}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select shipping location" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Change Status:
                </label>
                <Select onValueChange={handleStatusChange} value={invoiceStatus}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pay">Pay</SelectItem>
                    <SelectItem value="send">Send</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="exchangeRate" className="text-right font-medium">
                  Dollar Rate:
                </label>
                <input
                  type="number"
                  id="exchangeRate"
                  value={dollarExchangeRate}
                  onChange={(e) => setDollarExchangeRate(Number(e.target.value))}
                  className="col-span-3 p-2 rounded bg-gray-700 text-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="bg-[#240046] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shipping</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this invoice to {shippingLocation}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setInvoiceStatus("send")
                setIsConfirmDialogOpen(false)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

