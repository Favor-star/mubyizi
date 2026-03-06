import { GalleryPhaseGroup } from "../types";

export const mockGalleryTotal = 142;

export const mockGalleryGroups: GalleryPhaseGroup[] = [
  {
    phase: "Framing",
    date: "Today",
    dotColorClass: "bg-primary",
    media: [
      {
        id: "m-1",
        title: "East Wing Floor 3",
        tradeCategory: "framing",
        mediaType: "photo",
        uploadedBy: "Michael Chen",
        uploadTime: "09:45 AM",
        commentCount: 3
      },
      {
        id: "m-2",
        title: "Main Stairwell",
        tradeCategory: "framing",
        mediaType: "photo",
        uploadedBy: "Sarah Johnson",
        uploadTime: "08:12 AM",
        commentCount: 0
      },
      {
        id: "m-9",
        title: "West Wing Floor 2",
        tradeCategory: "framing",
        mediaType: "video",
        uploadedBy: "Emily Davis",
        uploadTime: "10:30 AM",
        commentCount: 5
      },
      {
        id: "m-11",
        title: "Framing Drone Overview",
        tradeCategory: "framing",
        mediaType: "360",
        uploadedBy: "Chris Brown",
        uploadTime: "11:00 AM",
        commentCount: 2
      }
    ]
  },
  {
    phase: "Foundation",
    date: "Yesterday",
    dotColorClass: "bg-success",
    media: [
      {
        id: "m-3",
        title: "North Wall Pour Drone View",
        tradeCategory: "concrete",
        mediaType: "video",
        uploadedBy: "David Smith",
        uploadTime: "4:30 PM",
        commentCount: 1
      },
      {
        id: "m-4",
        title: "Rebar Inspection",
        tradeCategory: "concrete",
        mediaType: "photo",
        uploadedBy: "Robert Wilson",
        uploadTime: "2:15 PM",
        commentCount: 0
      },
      {
        id: "m-10",
        title: "Foundation Drone Flyover",
        tradeCategory: "concrete",
        mediaType: "360",
        uploadedBy: "Laura Martinez",
        uploadTime: "3:00 PM",
        commentCount: 2
      }
    ]
  },
  {
    phase: "Electrical",
    date: "Mar 3",
    dotColorClass: "bg-warning",
    media: [
      {
        id: "m-5",
        title: "Panel Box Level 2",
        tradeCategory: "electrical",
        mediaType: "photo",
        uploadedBy: "James Lee",
        uploadTime: "11:00 AM",
        commentCount: 2
      },
      {
        id: "m-6",
        title: "Conduit Run B",
        tradeCategory: "electrical",
        mediaType: "video",
        uploadedBy: "Anna Torres",
        uploadTime: "10:30 AM",
        commentCount: 0
      }
    ]
  },
  {
    phase: "Plumbing",
    date: "Mar 1",
    dotColorClass: "bg-destructive",
    media: [
      {
        id: "m-7",
        title: "Rough-in West Side",
        tradeCategory: "plumbing",
        mediaType: "photo",
        uploadedBy: "Carlos Rivera",
        uploadTime: "3:00 PM",
        commentCount: 0
      },
      {
        id: "m-8",
        title: "Pressure Test",
        tradeCategory: "plumbing",
        mediaType: "video",
        uploadedBy: "Nina Patel",
        uploadTime: "1:45 PM",
        commentCount: 4
      }
    ]
  }
];
