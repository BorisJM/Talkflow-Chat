import { useEffect, useRef } from "react"

function TypingAnimation(){
const ref = useRef()

useEffect(() => {
const div = ref.current
if(div) {
    div.scrollIntoView({ behavior: "smooth", block: "end" });
}
}, [])

    return <div  ref={ref} className="relative flex gap-1 rounded-3xl px-2 py-3 w-fit bg-slate-100">
        <span className="h-3 w-3 inline-block bg-gray-500 rounded-full fill animate-[blink_1.5s_infinite]"></span>
        <span className="h-3 w-3 inline-block bg-gray-500 rounded-full fill animate-[blink_1.5s_infinite] animation-delay-200"></span>
        <span className="h-3 w-3 inline-block bg-gray-500 rounded-full fill animate-[blink_1.5s_infinite] animation-delay-400"></span>
    </div>
}

export default TypingAnimation