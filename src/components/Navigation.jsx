import { Link } from "react-router-dom"

export default function Navigation() {
    return (
        <div className="p-8 font-alata top-8">
            <div className=" flex justify-center">
                <Link to="/"><span className="p-2 border border-zinc-400 hover:bg-green-300 font-semibold">Calendrier</span></Link>
            </div>
        </div>
    )
}