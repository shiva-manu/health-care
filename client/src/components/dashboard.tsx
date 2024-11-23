'use client'

import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { addDays, format } from 'date-fns'
import { CalendarIcon, Plus, Activity, Pill, Utensils,Droplet } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { useNavigate } from 'react-router-dom'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
const healthData = [
  { name: 'Mon', steps: 7000, hydration: 2000 },
  { name: 'Tue', steps: 8500, hydration: 2200 },
  { name: 'Wed', steps: 9200, hydration: 2100 },
  { name: 'Thu', steps: 7800, hydration: 1900 },
  { name: 'Fri', steps: 8900, hydration: 2300 },
  { name: 'Sat', steps: 10000, hydration: 2400 },
  { name: 'Sun', steps: 9500, hydration: 2150 },
]

const medications = [
  { name: 'Vitamin D', dosage: '1000 IU', time: '8:00 AM' },
  { name: 'Omega-3', dosage: '1000 mg', time: '8:00 AM' },
  { name: 'Multivitamin', dosage: '1 tablet', time: '8:00 PM' },
]

const appointments = [
  { date: addDays(new Date(), 3), doctor: 'Dr. Smith', type: 'Annual Checkup' },
  { date: addDays(new Date(), 10), doctor: 'Dr. Johnson', type: 'Dental Cleaning' },
]

const foodLog = [
  { time: '8:00 AM', item: 'Oatmeal with berries', calories: 300 },
  { time: '12:30 PM', item: 'Grilled chicken salad', calories: 450 },
  { time: '4:00 PM', item: 'Apple with almond butter', calories: 200 },
]

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isFoodLogOpen, setIsFoodLogOpen] = useState(false)
  const navigate=useNavigate();

  const handleBookAppointment = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the appointment data to your backend
    console.log('Appointment booked!')
    setIsBookingOpen(false)
  }

  const handleLogFood = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the food log data to your backend
    console.log('Food logged!')
    setIsFoodLogOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">HealthCare Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Steps
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,500</div>
            <p className="text-xs text-muted-foreground">
              +20% from last week
            </p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Bar dataKey="steps" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">

              Hydration

            </CardTitle>

            <Droplet className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">2,150 ml</div>

            <p className="text-xs text-muted-foreground">

              Daily water intake

            </p>

            <div className="h-[80px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={healthData}>

                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />

                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />

                  <Bar dataKey="hydration" fill="#3b82f6" radius={[4, 4, 0, 0]} />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{appointment.doctor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.type} on {format(appointment.date, 'MMMM do, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Book Appointment</DialogTitle>
                  <DialogDescription>
                    Fill in the details to book your appointment.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBookAppointment}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="doctor" className="text-right">
                        Doctor
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                          <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                          <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input id="date" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input id="time" type="time" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Input id="reason" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Book Appointment</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <Card className="col-span-full md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Medication Schedule</CardTitle>
            <CardDescription>Your daily medication reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{med.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Food Log</CardTitle>
            <CardDescription>Track your daily food intake</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {foodLog.map((food, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">{food.item}</p>
                      <p className="text-sm text-muted-foreground">{food.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{food.calories} cal</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={isFoodLogOpen} onOpenChange={setIsFoodLogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Log Food
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log Food</DialogTitle>
                  <DialogDescription>
                    Enter details about your meal or snack.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogFood}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="food-item" className="text-right">
                        Food Item
                      </Label>
                      <Input id="food-item" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="calories" className="text-right">
                        Calories
                      </Label>
                      <Input id="calories" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input id="time" type="time" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea id="notes" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Log Food</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Health Calendar</CardTitle>
            <CardDescription>Track your appointments and health events</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
        <div>
          <Button onClick={()=>{
            navigate('/custamize')
          }}>Know about your meal</Button>
        </div>
      </div>
    </div>
  )
}