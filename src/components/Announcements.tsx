const Announcements = () => {
  return (
    <div className="p-4 bg-white rounded-md">
        <div className='flex items-center justify-between'>
            <h1 className="text-xl font-semibold">Announcements</h1>
            <span className="text-xs text-gray-400">View All</span>
        </div>
        <div className='flex flex-col gap-4 mt-4'>
            <div className='p-4 rounded-md bg-LamaSkyLight'>
                <div className='flex items-center justify-between'>
                    <h2 className="font-medium">🎓 Upcoming Parent-Teacher Conferences</h2>
                    <span className="px-1 py-1 text-xs text-gray-400 bg-white rounded-md">
                    2025-01-01
                    </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                    Parent-Teacher Conferences are scheduled for November 15-17. We encourage all parents to attend and discuss their child’s progress with the teachers. Please book your slot through the school portal.
                </p>
            </div>
            <div className='p-4 rounded-md bg-LamaPurple'>
                <div className='flex items-center justify-between'>
                    <h2 className="font-medium">📚 Library Book Fair</h2>
                    <span className="px-1 py-1 text-xs text-gray-500 bg-white rounded-md">
                    2025-01-01
                    </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                Our annual Library Book Fair is back! Students and parents are invited to explore a variety of books and resources. Special discounts will be available. Don’t miss out!  
                </p>
                
            </div>
            <div className='p-4 rounded-md bg-LamaYellow'>
                <div className='flex items-center justify-between'>
                    <h2 className="font-medium">🏆 Sports Day Celebration</h2>
                    <span className="px-1 py-1 text-xs text-gray-500 bg-white rounded-md">2025-01-01</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                Get ready for our annual Sports Day on December 5! Students will compete in various sports and games. Families are invited to join and cheer for their kids. Let’s make it a memorable event!    
                </p>
            </div>
        </div>
    </div>
  );
};

export default Announcements;