"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Clock, User, ArrowLeft, Search, Filter, GraduationCap, Phone, Calendar, BarChart } from "lucide-react";
import { Heading } from "@/components/Heading";

export default function ClassListPage() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const classes = [
    {
      id: 1,
      name: "Morning Class",
      schedule: "8:00 AM - 11:00 AM",
      instructor: "Mr. Dara",
      studentCount: 25,
      color: "bg-accent",
      iconColor: "text-primary",
      students: [
        { id: 1, name: "Sok Pisey", age: 22, phone: "012 345 678", enrollDate: "Jan 15, 2025", status: "Active" },
        { id: 2, name: "Chan Srey Mao", age: 21, phone: "012 456 789", enrollDate: "Jan 10, 2025", status: "Active" },
        { id: 3, name: "Lim Dara", age: 23, phone: "012 567 890", enrollDate: "Jan 20, 2025", status: "Active" },
        { id: 4, name: "Pov Makara", age: 22, phone: "012 678 901", enrollDate: "Jan 12, 2025", status: "Active" },
      ],
    },
    {
      id: 2,
      name: "Afternoon Class",
      schedule: "1:00 PM - 4:00 PM",
      instructor: "Ms. Srey Lin",
      studentCount: 30,
      color: "bg-secondary",
      iconColor: "text-primary",
      students: [
        { id: 5, name: "Ngy Sophal", age: 20, phone: "012 678 901", enrollDate: "Jan 8, 2025", status: "Active" },
        { id: 6, name: "Pheakdey Roth", age: 24, phone: "012 789 012", enrollDate: "Jan 18, 2025", status: "Active" },
        { id: 7, name: "Vanna Chea", age: 22, phone: "012 890 123", enrollDate: "Jan 5, 2025", status: "Active" },
      ],
    },
    {
      id: 3,
      name: "Evening Class",
      schedule: "5:00 PM - 8:00 PM",
      instructor: "Mr. Rith",
      studentCount: 18,
      color: "bg-muted",
      iconColor: "text-primary",
      students: [
        { id: 8, name: "Bopha Kim", age: 25, phone: "012 901 234", enrollDate: "Jan 22, 2025", status: "Active" },
        { id: 9, name: "Samnang Ouk", age: 21, phone: "012 012 345", enrollDate: "Jan 16, 2025", status: "Active" },
      ],
    },
  ];

  const filteredStudents = selectedClass?.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Student List View
  if (selectedClass) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedClass(null)}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{selectedClass.name}</h1>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {selectedClass.schedule}
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-card border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-foreground">{selectedClass.studentCount}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="text-lg font-semibold text-foreground">{selectedClass.instructor}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-primary">{selectedClass.studentCount}</p>
                  </div>
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border">
              <CardContent className="p-4">
                <Button className="w-full h-full bg-primary text-primary-foreground hover:bg-primary/90">
                  + Add Student
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card className="bg-card border">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search students by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Table */}
          <Card className="bg-card border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Age</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Enroll Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStudents.map((student, index) => (
                      <tr key={student.id} className="hover:bg-accent/50 transition">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.age}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {student.enrollDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="hover:bg-accent">
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-accent">
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Class List View (Main Page)
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <Heading
                 title="Class "
                 description="Class Mangement"
               />

      

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Total Classes</p>
                  <p className="text-4xl font-bold mt-2">{classes.length}</p>
                </div>
                <GraduationCap className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary text-secondary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/70 text-sm">Total Students</p>
                  <p className="text-4xl font-bold mt-2">
                    {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
                  </p>
                </div>
                <Users className="h-12 w-12 opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent text-accent-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/70 text-sm">Instructors</p>
                  <p className="text-4xl font-bold mt-2">{classes.length}</p>
                </div>
                <User className="h-12 w-12 opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="bg-card border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedClass(cls)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-xl text-card-foreground">
                  <div className={`p-3 rounded-full ${cls.color}`}>
                    <Clock className={`h-6 w-6 ${cls.iconColor}`} />
                  </div>
                  <span>{cls.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-3 ${cls.color} rounded-lg`}>
                    <User className={`h-5 w-5 ${cls.iconColor}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">Instructor</p>
                      <p className="font-medium text-foreground">{cls.instructor}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 ${cls.color} rounded-lg`}>
                    <Clock className={`h-5 w-5 ${cls.iconColor}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">Schedule</p>
                      <p className="font-medium text-foreground">{cls.schedule}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 ${cls.color} rounded-lg`}>
                    <Users className={`h-5 w-5 ${cls.iconColor}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">Students Enrolled</p>
                      <p className="font-medium text-foreground">{cls.studentCount} Students</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  View Students →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}