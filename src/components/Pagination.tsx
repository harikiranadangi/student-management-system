const Pagination = () => {
  return (
    <div className="flex items-center justify-between p-4 text-gray-500">
        <button disabled className="px-4 py-2 text-xs font-semibold rounded-md bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
        <div className='flex items-center gap-2 text-sm'>
            <button className="px-2 rounded-sm bg-LamaSky">1</button>
            <button className="px-2 rounded-sm">2</button>
            <button className="px-2 rounded-sm">3</button>
            ...
            <button className="px-2 rounded-sm">10</button>

        </div>
        <button className="px-4 py-2 text-xs font-semibold rounded-md bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
    </div> 
  );
};

export default Pagination;