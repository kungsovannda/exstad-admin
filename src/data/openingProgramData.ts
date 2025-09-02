import { openingProgramType } from "@/types/openingProgramType";

export const openingProgramData: openingProgramType[] = [
    {
        id: 1,
        title: "Pre University Scholarship",
        generation:1,
        image:"",
        shortcourseimage:"/image/logo/shortcourseposter.jpg",
        qrimage:"https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        description: "Get ready for university with our Pre University Scholarship program. This comprehensive course is designed to equip you with the essential skills and knowledge needed to excel in your higher education journey. From academic writing and research skills to time management and critical thinking, our expert instructors will guide you through a curriculum tailored to prepare you for the challenges of university life. Join us and take the first step towards a successful academic future.",
        classes:[
            {
                id:1,
                title:"Pre Morning",
                shift:"Morning",
                isWeekend:false,
                totalSlots:200,
            },
            {
                id:2,
                title:"Pre Afternoon",
                shift:"Afternoon",
                isWeekend:false,
                totalSlots:200,
            },

        ],
        activities: [
            {
                id:1,
                title:"Orientation Session",
                activityType:[{
                    id:1,
                    title:"Applicant List",
                    description:"List of Candidates for the Entrance Examination for the Digital Technology Scholarship (Pre-University), 5th Generation, Academic Year 2025 of the Institute of Science and Technology Advanced Development (ISTAD).",
                    image:"",
                }]
            },
             {
                id:1,
                title:"Orientation Session",
                activityType:[{
                    id:1,
                    title:"Applicant List",
                    description:"List of Candidates for the Entrance Examination for the Digital Technology Scholarship (Pre-University), 5th Generation, Academic Year 2025 of the Institute of Science and Technology Advanced Development (ISTAD).",
                    image:"",
                }]
            }
        ],
        timeline: [
            {
                id:1,
                title:"Application Deadline",
                date:"August 12, 2024"
            },
            {
                id:2,
                title:"Orientation Session",
                date:"August 20, 2024"
            },
            {
                id:3,
                title:"Academic Skills Workshop",
                date:"August 27, 2024"
            },
            {
                id:4,
                title:"Time Management Seminar",
                date:"September 3, 2024"
            },
            {
                id:5,
                title:"Critical Thinking Exercises",
                date:"September 10, 2024"
            },
            {
                id:6,
                title:"Program Completion",
                date:"September 17, 2024"
            }
        ]
    }
]