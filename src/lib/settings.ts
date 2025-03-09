

export const ITEM_PER_PAGE = 50;

type RouteAccessMap = {
  [key: string]: string[]; // Maps routes to allowed roles
};

export const routeAccessMap: RouteAccessMap = {
  // Admin-specific routes
  "/admin(.*)": ["admin"],

  // Role-specific base routes
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],

  // Admin-specific list routes
  "/list/subjects": ["admin"],
  "/list/teachers": ["admin"],

  // Routes accessible to admin and teacher
  
  "/list/students": ["admin", "teacher"],
  "/list/classes": ["admin", "teacher"],

  // Routes accessible to admin, teacher, and student
  "/list/exams": ["admin", "teacher", "student"],
  "/list/assignments": ["admin", "teacher", "student"],
  "/list/results": ["admin", "teacher", "student"],
  "/list/attendance": ["admin", "teacher", "student"],
  "/list/events": ["admin", "teacher", "student"],
  "/list/announcements": ["admin", "teacher", "student"],
  "/list/lessons": ["admin", "teacher", "student"],
  "/list/messages" : ["admin", "teacher", "student"],
  

  
};

  
  