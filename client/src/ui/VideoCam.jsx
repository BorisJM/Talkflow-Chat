import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function VideoCam() {
 const {tracks} = useSelector((state) => state.features) 
const ref = useRef()

useEffect(() => {
if(tracks?.localVideoTrack) {
  tracks?.localVideoTrack?.play(ref.current)
} 
if(Object.keys(tracks?.remoteVideoTracks).length) {
  tracks.remoteVideoTracks.play(ref.current)
}
}, [tracks])

if(!tracks.localVideoTrack && !Object.keys(tracks.remoteVideoTracks).length) return 
  return  <div>
{tracks.localVideoTrack &&   <div ref={ref} className={`bg-transparent absolute right-0 top-0 w-[250px] h-[125px] -translate-x-5 translate-y-5`}></div>}
  {!!Object.keys(tracks.remoteVideoTracks).length && <div ref={ref} className="max-[768px]:w-[250px] max-[768px]:h-[150px] w-[450px] h-[300px] bg-transparent">
    </div>}
  </div>

}

export default VideoCam;
