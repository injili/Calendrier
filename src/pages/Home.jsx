import { Link } from "react-router-dom"

export default function Home() {
    return(
        <div className="font-alata w-full h-max flex flex-col items-center pt-56">
            <div className="flex gap-96 mb-12">
                <Link to="/host"><span className="p-4 border border-zinc-400 hover:bg-green-300 font-semibold text-lg">Host's Panel</span></Link>
                <Link to="/guest"><span className="p-4 border border-zinc-400 hover:bg-green-300 font-semibold text-lg">Guest's Panel</span></Link>
            </div>
            <p className="text-center text-xl max-w-5xl">This platform is specifically designed to assist villa owners in efficiently managing their bookings through an integrated calendar system, replacing the traditional use of spreadsheets. Villa owners can easily make reservations and set seasonal pricing for their properties, while guests can conveniently check availability throughout the year.</p>
            <h1 className="text-[300px] leading-none font-bold h-4">Calendrier</h1>
            
        </div>
    )
}